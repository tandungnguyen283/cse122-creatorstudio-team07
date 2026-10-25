(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  const CHECKS = ["Đúng nội dung brief đã duyệt", "Màu sắc khớp moodboard", "Tệp và tên phiên bản đúng chuẩn"];
  let pid = CS.ui.getProjectId(user);
  let selected = null;
  let checked = {}; // versionId -> Set(index)
  let editingComment = null;

  if (!pid) { CS.ui.state($("queue"), "empty", { icon: "📁", msg: "Bạn chưa phụ trách dự án nào." }); return; }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; selected = null; load(); });

  const queue = () => CS.store.list("versions").filter((v) => v.projectId === pid && v.status === "review");

  function load() {
    CS.ui.state($("queue"), "loading"); CS.ui.state($("detail"), "loading");
    CS.api.list("versions", (v) => v.projectId === pid).then(() => {
      const q = queue();
      if (!q.length) {
        CS.ui.state($("queue"), "empty", { icon: "✅", msg: "Không có phiên bản nào chờ review." });
        CS.ui.state($("detail"), "empty", { icon: "🧐", msg: "Khi nhà thiết kế gửi review, phiên bản sẽ xuất hiện ở đây." });
        return;
      }
      if (!selected || !q.find((v) => v.id === selected)) selected = q[0].id;
      renderQueue(); renderDetail();
    }).catch((e) => { CS.ui.state($("queue"), "error", { msg: e.message, onRetry: load }); $("detail").innerHTML = ""; });
  }

  function renderQueue() {
    $("queue").innerHTML = queue().map((v) => `<button class="vitem" data-id="${v.id}" aria-pressed="${v.id === selected}">
      <span class="dot" style="background:${esc(v.color)}" aria-hidden="true"></span>
      <span style="flex:1"><strong>${esc(v.name)}</strong><br><small style="color:var(--muted)">${esc(CS.ui.userName(v.authorId))} · ${CS.ui.fmtDate(v.createdAt)}</small></span></button>`).join("");
  }
  $("queue").addEventListener("click", (e) => { const b = e.target.closest(".vitem"); if (!b) return; selected = b.dataset.id; editingComment = null; renderQueue(); renderDetail(); });

  function renderDetail() {
    const v = CS.store.get("versions", selected);
    const set = (checked[v.id] = checked[v.id] || new Set());
    const comments = CS.store.list("comments").filter((c) => c.versionId === v.id && c.internal);
    const openInternal = comments.filter((c) => c.status === "open").length;
    const allChecked = set.size === CHECKS.length;
    $("detail").innerHTML = `
      <section class="card">
        <header style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem"><h2>${esc(v.name)} – ${esc(CS.store.get("projects", v.projectId).name)}</h2>${CS.ui.statusBadge(v.status)}</header>
        <figure class="preview" style="background:${esc(v.color)}" role="img" aria-label="Xem trước ${esc(v.name)}">${esc(v.name)}</figure>
        <p style="margin-top:.6rem">${esc(v.note)}</p>
        <h3>Checklist trước khi gửi khách</h3>
        ${CHECKS.map((c, i) => `<label class="switch"><input type="checkbox" data-check="${i}" ${set.has(i) ? "checked" : ""}> ${esc(c)}</label>`).join("")}
        ${openInternal ? `<p class="alert warn" style="margin-top:.7rem">Còn ${openInternal} góp ý nội bộ chưa xử lý.</p>` : ""}
        <div class="actions" style="margin-top:.7rem">
          <button class="btn ok" id="approveBtn" ${allChecked ? "" : "disabled"} ${allChecked ? "" : 'title="Hoàn thành checklist để gửi khách"'}>Gửi cho khách hàng</button>
          <button class="btn danger" id="returnBtn">Trả lại designer</button>
        </div>
      </section>
      <section class="card"><h3>Góp ý nội bộ (${comments.length})</h3>
        <section aria-label="Danh sách góp ý nội bộ">${commentsHtml(comments)}</section>
        <form id="cmForm" novalidate style="margin-top:.7rem"><div class="field"><label for="cmText">Thêm góp ý nội bộ</label><textarea id="cmText" required minlength="5" style="min-height:70px"></textarea><small class="field-error"></small></div><button class="btn sm primary" type="submit">Gửi</button></form>
      </section>`;
    wire(v);
  }

  function commentsHtml(list) {
    if (!list.length) return '<section class="state"><span class="ico" aria-hidden="true">💬</span><p>Chưa có góp ý nội bộ.</p></section>';
    return list.map((c) => {
      if (editingComment === c.id) return `<article class="comment"><label class="sr-only" for="editText">Sửa góp ý</label><textarea id="editText" style="min-height:60px">${esc(c.text)}</textarea><div class="actions" style="margin-top:.3rem"><button class="btn sm primary" data-save="${c.id}">Lưu</button><button class="btn sm" data-cancel>Hủy</button></div></article>`;
      return `<article class="comment"><header class="who">${esc(CS.ui.userName(c.authorId))} · ${CS.ui.fmtDate(c.createdAt)} ${CS.ui.statusBadge(c.status)}</header>${esc(c.text)}
        <div class="actions" style="margin-top:.3rem"><button class="btn sm" data-toggle="${c.id}">${c.status === "open" ? "Đã xử lý" : "Mở lại"}</button>${c.authorId === user.id ? `<button class="btn sm" data-edit="${c.id}">Sửa</button>` : ""}</div></article>`;
    }).join("");
  }

  function wire(v) {
    const d = $("detail");
    d.querySelectorAll("[data-check]").forEach((c) => (c.onchange = () => { const s = checked[v.id]; c.checked ? s.add(+c.dataset.check) : s.delete(+c.dataset.check); renderDetail(); }));
    $("approveBtn").onclick = () => {
      CS.store.list("versions").filter((x) => x.projectId === v.projectId).forEach((x) => CS.store.update("versions", x.id, { isLatest: false }));
      CS.store.update("versions", v.id, { status: "pending", isLatest: true });
      CS.ui.toast("Đã gửi " + v.name + " cho khách hàng duyệt.", "ok"); selected = null; load();
    };
    $("returnBtn").onclick = () => { $("returnForm").reset(); $("returnForm").querySelector(".field-error").textContent = ""; CS.ui.openModal("returnModal"); };
    $("cmForm").onsubmit = (e) => {
      e.preventDefault(); if (!CS.ui.validate($("cmForm"))) return;
      CS.store.add("comments", { versionId: v.id, authorId: user.id, text: $("cmText").value.trim(), status: "open", internal: true, createdAt: CS.ui.today() });
      CS.ui.toast("Đã thêm góp ý nội bộ.", "ok"); renderDetail();
    };
    d.querySelectorAll("[data-toggle]").forEach((b) => (b.onclick = () => { const c = CS.store.get("comments", b.dataset.toggle); CS.store.update("comments", c.id, { status: c.status === "open" ? "resolved" : "open" }); renderDetail(); }));
    d.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => { editingComment = b.dataset.edit; renderDetail(); }));
    d.querySelectorAll("[data-cancel]").forEach((b) => (b.onclick = () => { editingComment = null; renderDetail(); }));
    d.querySelectorAll("[data-save]").forEach((b) => (b.onclick = () => {
      const t = $("editText").value.trim(); if (t.length < 5) { CS.ui.toast("Góp ý cần ít nhất 5 ký tự.", "err"); return; }
      CS.store.update("comments", b.dataset.save, { text: t }); editingComment = null; renderDetail();
    }));
  }

  $("returnForm").onsubmit = (e) => {
    e.preventDefault(); if (!CS.ui.validate($("returnForm"))) return;
    const v = CS.store.get("versions", selected);
    CS.store.add("comments", { versionId: v.id, authorId: user.id, text: $("rtReason").value.trim(), status: "open", internal: true, createdAt: CS.ui.today() });
    CS.store.update("versions", v.id, { status: "changes" });
    CS.ui.closeModal("returnModal"); CS.ui.toast("Đã trả " + v.name + " cho nhà thiết kế.", "ok"); selected = null; load();
  };

  load();
})();
