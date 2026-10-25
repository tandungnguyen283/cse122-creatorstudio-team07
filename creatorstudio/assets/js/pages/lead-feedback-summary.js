(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let pid = CS.ui.getProjectId(user);
  let vid = null;
  let picked = new Set();
  let result = null; // { items:[{title,priority,keep}], ...}

  if (!pid) { CS.ui.state($("commentList"), "empty", { icon: "📁", msg: "Bạn chưa phụ trách dự án nào." }); $("runAI").disabled = true; $("addForm").hidden = true; return; }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; vid = null; picked.clear(); result = null; $("aiOut").innerHTML = ""; load(); });

  const versions = () => CS.store.list("versions").filter((v) => v.projectId === pid && !["draft", "archived"].includes(v.status)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  function load() {
    CS.ui.state($("commentList"), "loading");
    CS.api.list("versions", (v) => v.projectId === pid).then(() => {
      const vs = versions();
      if (!vs.length) {
        $("versionSelect").innerHTML = "<option>Chưa có phiên bản</option>"; $("versionSelect").disabled = true;
        CS.ui.state($("commentList"), "empty", { icon: "🗂️", msg: "Dự án chưa có phiên bản nào để tổng hợp feedback." });
        $("runAI").disabled = true; $("addForm").hidden = true; return;
      }
      $("versionSelect").disabled = false; $("runAI").disabled = false; $("addForm").hidden = false;
      if (!vid || !vs.find((v) => v.id === vid)) vid = (vs.find((v) => v.isLatest) || vs[0]).id;
      $("versionSelect").innerHTML = vs.map((v) => `<option value="${v.id}" ${v.id === vid ? "selected" : ""}>${esc(v.name)}${v.isLatest ? " (mới nhất)" : ""}</option>`).join("");
      renderComments();
    }).catch((e) => CS.ui.state($("commentList"), "error", { msg: e.message, onRetry: load }));
  }
  $("versionSelect").onchange = () => { vid = $("versionSelect").value; picked.clear(); result = null; $("aiOut").innerHTML = ""; renderComments(); };

  const commentsOf = () => CS.store.list("comments").filter((c) => c.versionId === vid);

  function renderComments() {
    const list = commentsOf(); const host = $("commentList");
    $("selectAll").checked = list.length > 0 && list.every((c) => picked.has(c.id));
    if (!list.length) { CS.ui.state(host, "empty", { icon: "💬", msg: "Phiên bản này chưa có góp ý nào." }); return; }
    host.innerHTML = list.map((c) => `<article class="comment"><label class="switch" style="font-weight:400"><input type="checkbox" data-pick="${c.id}" ${picked.has(c.id) ? "checked" : ""}>
      <span><span class="who">${esc(CS.ui.userName(c.authorId))} ${c.internal ? '<span class="badge brand">Nội bộ</span>' : '<span class="badge info">Khách</span>'} ${CS.ui.statusBadge(c.status)}</span><br>${esc(c.text)}</span></label>
      <div class="actions" style="margin:.3rem 0 0 1.7rem"><button class="btn sm" data-edit="${c.id}">Sửa</button><button class="btn sm danger" data-del="${c.id}">Xóa</button></div></article>`).join("");
  }
  $("commentList").addEventListener("change", (e) => {
    const c = e.target.closest("[data-pick]"); if (!c) return;
    c.checked ? picked.add(c.dataset.pick) : picked.delete(c.dataset.pick); renderComments();
  });
  $("commentList").addEventListener("click", (e) => {
    const ed = e.target.closest("[data-edit]"); const del = e.target.closest("[data-del]");
    if (ed) {
      const c = CS.store.get("comments", ed.dataset.edit);
      const t = window.prompt("Sửa nội dung góp ý:", c.text);
      if (t !== null) { if (t.trim().length < 5) CS.ui.toast("Góp ý cần ít nhất 5 ký tự.", "err"); else { CS.store.update("comments", c.id, { text: t.trim() }); renderComments(); } }
    } else if (del && CS.ui.confirm("Xóa góp ý này?")) { CS.store.remove("comments", del.dataset.del); picked.delete(del.dataset.del); renderComments(); }
  });
  $("selectAll").onchange = () => { const l = commentsOf(); $("selectAll").checked ? l.forEach((c) => picked.add(c.id)) : picked.clear(); renderComments(); };

  $("addForm").onsubmit = (e) => {
    e.preventDefault(); if (!CS.ui.validate($("addForm"))) return;
    CS.store.add("comments", { versionId: vid, authorId: user.id, text: $("newFb").value.trim(), status: "open", internal: false, createdAt: CS.ui.today() });
    $("addForm").reset(); CS.ui.toast("Đã thêm góp ý.", "ok"); renderComments();
  };

  /* ---------- AI-2 ---------- */
  function runAI() {
    const out = $("aiOut");
    const chosen = commentsOf().filter((c) => picked.has(c.id));
    if (!chosen.length) { out.innerHTML = '<p class="alert warn" role="alert" style="margin-top:.8rem">Hãy chọn ít nhất một góp ý để AI tổng hợp.</p>'; return; }
    $("runAI").disabled = true; CS.AI.ui.processing(out);
    CS.AI.summarizeFeedback(chosen).then((r) => { result = r; r.items.forEach((i) => (i.keep = true)); renderResult(); })
      .catch((e) => {
        CS.AI.ui.failure(out, e);
        out.querySelector("[data-ai-retry]").onclick = runAI;
        out.querySelector("[data-ai-manual]").onclick = manual;
        out.querySelector("[data-ai-report]").onclick = CS.AI.ui.report;
      }).finally(() => { $("runAI").disabled = false; });
  }
  function manual() {
    const chosen = commentsOf().filter((c) => picked.has(c.id));
    result = { items: chosen.map((c) => ({ title: c.text.slice(0, 80), priority: "medium", keep: true, source: c.internal ? "Nội bộ" : "Khách hàng" })), confidence: 100, low: false, why: ["Bạn đang tạo danh sách thủ công, không có gợi ý của AI."] };
    renderResult(true);
  }

  function renderResult(isManual) {
    const out = $("aiOut"); const r = result;
    const designer = CS.store.get("projects", pid).designerId;
    const dueDefault = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
    out.innerHTML = `<section class="ai-result">
      ${r.low ? '<p class="alert warn">AI chưa chắc chắn về kết quả này. Hãy rà soát từng mục.</p>' : ""}
      ${designer ? "" : '<p class="alert err">Dự án chưa có nhà thiết kế được giao nên chưa thể tạo việc.</p>'}
      <form id="itemsForm" novalidate>
      ${r.items.map((it, i) => `<article class="card" style="padding:.6rem .7rem;margin-bottom:.5rem">
        <label class="switch"><input type="checkbox" data-keep="${i}" ${it.keep ? "checked" : ""}> Giữ mục này · <span class="badge">${esc(it.source || "")}</span></label>
        <div class="field" style="margin:.3rem 0"><label class="sr-only" for="it${i}">Tên việc</label><input id="it${i}" type="text" data-title="${i}" value="${esc(it.title)}" required minlength="5"><small class="field-error"></small></div>
        <label class="sr-only" for="pr${i}">Ưu tiên</label>
        <select id="pr${i}" data-pri="${i}" style="width:auto"><option value="high" ${it.priority === "high" ? "selected" : ""}>Ưu tiên cao</option><option value="medium" ${it.priority === "medium" ? "selected" : ""}>Ưu tiên vừa</option><option value="low" ${it.priority === "low" ? "selected" : ""}>Ưu tiên thấp</option></select>
      </article>`).join("")}
      <div class="field"><label for="dueAll">Hạn hoàn thành *</label><input id="dueAll" type="date" value="${dueDefault}" required data-future="1"><small class="field-error"></small></div>
      </form>
      ${isManual ? "" : CS.AI.ui.why(r.why, r.confidence, r.low)}
      <div class="actions" style="margin-top:.8rem">
        <button class="btn ok sm" id="aiAccept" ${designer ? "" : "disabled"}>Chấp nhận &amp; tạo việc</button>
        <button class="btn sm" id="aiRegen">Tạo lại</button>
        <button class="btn danger sm" id="aiReject">Từ chối</button>
      </div></section>`;
    out.querySelectorAll("[data-keep]").forEach((c) => (c.onchange = () => (r.items[c.dataset.keep].keep = c.checked)));
    out.querySelectorAll("[data-title]").forEach((c) => (c.oninput = () => (r.items[c.dataset.title].title = c.value)));
    out.querySelectorAll("[data-pri]").forEach((c) => (c.onchange = () => (r.items[c.dataset.pri].priority = c.value)));
    $("aiRegen").onclick = runAI;
    $("aiReject").onclick = () => { result = null; out.innerHTML = '<p style="color:var(--muted);margin-top:.8rem">Đã bỏ kết quả AI.</p>'; };
    $("aiAccept").onclick = () => {
      if (!r.items.some((i) => i.keep)) { CS.ui.toast("Hãy giữ ít nhất một mục.", "err"); return; }
      if (!CS.ui.validate($("itemsForm"))) { CS.ui.toast("Vui lòng kiểm tra các trường báo lỗi.", "err"); return; }
      const kept = r.items.filter((i) => i.keep);
      kept.forEach((i) => CS.store.add("tasks", { projectId: pid, title: i.title.trim(), assigneeId: designer, status: "todo", priority: i.priority, due: $("dueAll").value, archived: false }));
      commentsOf().filter((c) => picked.has(c.id)).forEach((c) => CS.store.update("comments", c.id, { status: "resolved" }));
      CS.ui.toast("Đã tạo " + kept.length + " công việc trên bảng.", "ok");
      picked.clear(); result = null;
      out.innerHTML = '<p class="alert ok" style="margin-top:.8rem">Đã giao ' + kept.length + ' việc cho nhà thiết kế. <a href="lead-task-board.html">Xem bảng công việc</a></p>';
      renderComments();
    };
  }
  $("runAI").onclick = runAI;

  load();
})();
