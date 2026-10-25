(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let pid = CS.ui.getProjectId(user);
  let selected = null;
  let pendingDecision = null;
  let editingComment = null;

  if (!pid) {
    CS.ui.state($("versionList"), "empty", { icon: "📁", msg: "Bạn chưa có dự án nào.", action: '<a class="btn primary" href="client-project-overview.html">Đến Tổng quan dự án</a>' });
    CS.ui.state($("versionDetail"), "empty", { icon: "🕒", msg: "Tạo dự án và chờ nhà thiết kế gửi phiên bản để duyệt." });
    return;
  }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; selected = null; load(); });

  function versionsOf() {
    return CS.store.list("versions").filter((v) => v.projectId === pid && !["archived", "draft", "review"].includes(v.status))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  let loadReq = 0; // bỏ qua kết quả cũ khi đổi dự án nhanh
  function load() {
    const my = ++loadReq;
    CS.ui.state($("versionList"), "loading");
    CS.ui.state($("versionDetail"), "loading");
    CS.api.list("versions", (v) => v.projectId === pid).then(() => {
      if (my !== loadReq) return;
      const list = versionsOf();
      if (!list.length) {
        CS.ui.state($("versionList"), "empty", { icon: "🎨", msg: "Chưa có phiên bản nào được gửi." });
        CS.ui.state($("versionDetail"), "empty", { icon: "🕒", msg: "Khi nhà thiết kế gửi phiên bản, bạn sẽ thấy ở đây." });
        return;
      }
      if (!selected || !list.find((v) => v.id === selected)) selected = (list.find((v) => v.isLatest) || list[0]).id;
      renderList(list); renderDetail();
    }).catch((e) => {
      if (my !== loadReq) return;
      CS.ui.state($("versionList"), "error", { msg: e.message, onRetry: load });
      $("versionDetail").innerHTML = "";
    });
  }

  function renderList(list) {
    $("versionList").innerHTML = list.map((v) => `
      <button class="vitem" data-id="${v.id}" aria-pressed="${v.id === selected}">
        <span class="dot" style="background:${esc(v.color)}" aria-hidden="true"></span>
        <span style="flex:1"><strong>${esc(v.name)}</strong> ${v.isLatest ? '<span class="badge brand">Mới nhất</span>' : ""}<br>
        <small style="color:var(--muted)">${CS.ui.fmtDate(v.createdAt)}</small></span>${CS.ui.statusBadge(v.status)}
      </button>`).join("");
  }
  $("versionList").addEventListener("click", (e) => {
    const b = e.target.closest(".vitem"); if (!b) return;
    selected = b.dataset.id; editingComment = null; renderList(versionsOf()); renderDetail();
  });

  /* Số lượt đã dùng được lưu theo dự án (trạng thái phiên bản bị ghi đè khi gửi lại nên không đếm từ đó được) */
  function revisionsUsed() {
    const p = CS.store.get("projects", pid);
    if (typeof p.revisionsUsed === "number") return p.revisionsUsed;
    return CS.store.list("versions").filter((x) => x.projectId === pid && ["changes", "rejected"].includes(x.status)).length;
  }

  /* keep = true: giữ lại chữ đang gõ trong ô "Thêm góp ý" khi chỉ vẽ lại vì sửa/xóa góp ý khác */
  function renderDetail(keep) {
    const prevDraft = keep && $("newComment") ? $("newComment").value : "";
    const v = CS.store.get("versions", selected);
    const host = $("versionDetail");
    const project = CS.store.get("projects", pid);
    const comments = CS.store.list("comments").filter((c) => c.versionId === v.id && !c.internal);
    const revisions = revisionsUsed();
    const canDecide = v.status === "pending" && v.isLatest;
    const outOfRevisions = revisions >= project.settings.maxRevisions;
    const reason = !v.isLatest ? "Đây không phải phiên bản mới nhất nên không thể duyệt." : v.status !== "pending" ? "Phiên bản này đã có quyết định."
      : outOfRevisions ? "Dự án đã dùng hết lượt chỉnh sửa (" + revisions + "/" + project.settings.maxRevisions + "). Bạn chỉ có thể duyệt, hoặc nhờ quản trị viên tăng giới hạn." : "";

    host.innerHTML = `
      <section class="card">
        <header style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap">
          <h2>${esc(project.name)} – ${esc(v.name)}</h2>${CS.ui.statusBadge(v.status)}
        </header>
        <figure class="preview" style="background:${esc(v.color)}" role="img" aria-label="Xem trước phiên bản ${esc(v.name)}">${esc(v.name)}</figure>
        <p style="margin-top:.7rem">${esc(v.note)}</p>
        <p style="color:var(--muted);font-size:.85rem">Thiết kế bởi ${esc(CS.ui.userName(v.authorId))} · ${CS.ui.fmtDate(v.createdAt)} · Đã dùng ${revisions}/${project.settings.maxRevisions} lượt chỉnh sửa</p>
        ${reason ? `<p class="alert info">${esc(reason)}</p>` : ""}
        <div class="actions">
          <button class="btn ok" data-decide="approved" ${canDecide ? "" : "disabled"}>Duyệt</button>
          <button class="btn" data-decide="changes" ${canDecide && !outOfRevisions ? "" : "disabled"}>Yêu cầu chỉnh sửa</button>
          <button class="btn danger" data-decide="rejected" ${canDecide && !outOfRevisions ? "" : "disabled"}>Từ chối</button>
        </div>
      </section>
      <section class="card" aria-labelledby="cmTitle">
        <h3 id="cmTitle">Góp ý (${comments.length})</h3>
        <div id="commentList">${commentsHtml(comments)}</div>
        ${project.settings.allowComments ? commentFormHtml() : '<p class="alert warn">Dự án này đang tắt chức năng góp ý.</p>'}
      </section>`;
    wireDetail();
    if (prevDraft && $("newComment")) $("newComment").value = prevDraft;
  }

  function commentsHtml(list) {
    if (!list.length) return '<section class="state"><span class="ico" aria-hidden="true">💬</span><p>Chưa có góp ý nào cho phiên bản này.</p></section>';
    return list.map((c) => {
      const mine = c.authorId === user.id;
      if (editingComment === c.id) {
        return `<article class="comment"><label for="editText" class="sr-only">Sửa góp ý</label><textarea id="editText" style="min-height:70px">${esc(c.text)}</textarea>
          <div class="actions" style="margin-top:.4rem"><button class="btn sm primary" data-save="${c.id}">Lưu</button><button class="btn sm" data-cancel>Hủy</button></div></article>`;
      }
      return `<article class="comment"><header class="who">${esc(CS.ui.userName(c.authorId))} · ${CS.ui.fmtDate(c.createdAt)} ${CS.ui.statusBadge(c.status)}</header>
        <p style="margin:0">${esc(c.text)}</p>
        ${mine && c.status === "open" ? `<div class="actions" style="margin-top:.3rem"><button class="btn sm" data-edit="${c.id}">Sửa</button><button class="btn sm danger" data-del="${c.id}">Xóa</button></div>` : ""}</article>`;
    }).join("");
  }
  function commentFormHtml() {
    return `<form id="commentForm" novalidate style="margin-top:.8rem">
      <div class="field"><label for="newComment">Thêm góp ý</label>
      <textarea id="newComment" required minlength="5" style="min-height:70px" placeholder="Ví dụ: Logo cần to hơn ở góc trái."></textarea>
      <small class="field-error" aria-live="polite"></small></div>
      <button class="btn primary sm" type="submit">Gửi góp ý</button></form>`;
  }

  function wireDetail() {
    const host = $("versionDetail");
    host.querySelectorAll("[data-decide]").forEach((b) => (b.onclick = () => openDecision(b.dataset.decide)));
    const cf = $("commentForm");
    if (cf) cf.onsubmit = (e) => {
      e.preventDefault();
      if (!CS.ui.validate(cf)) return;
      CS.store.add("comments", { versionId: selected, authorId: user.id, text: $("newComment").value.trim(), status: "open", internal: false, createdAt: CS.ui.today() });
      CS.ui.toast("Đã gửi góp ý.", "ok"); renderDetail(false);
    };
    host.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => { editingComment = b.dataset.edit; renderDetail(true); const t = $("editText"); if (t) t.focus(); }));
    host.querySelectorAll("[data-cancel]").forEach((b) => (b.onclick = () => { editingComment = null; renderDetail(true); }));
    host.querySelectorAll("[data-save]").forEach((b) => (b.onclick = () => {
      const val = $("editText").value.trim();
      if (val.length < 5) { CS.ui.toast("Góp ý cần ít nhất 5 ký tự.", "err"); return; }
      CS.store.update("comments", b.dataset.save, { text: val }); editingComment = null; CS.ui.toast("Đã cập nhật góp ý.", "ok"); renderDetail(true);
    }));
    host.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => {
      if (CS.ui.confirm("Xóa góp ý này?")) { CS.store.remove("comments", b.dataset.del); CS.ui.toast("Đã xóa góp ý."); renderDetail(true); }
    }));
  }

  /* ---------- Quyết định (cập nhật trạng thái) ---------- */
  function openDecision(kind) {
    pendingDecision = kind;
    const v = CS.store.get("versions", selected);
    const label = { approved: "Duyệt", changes: "Yêu cầu chỉnh sửa", rejected: "Từ chối" }[kind];
    $("decTitle").textContent = label + " " + v.name;
    $("decSummary").textContent = kind === "approved" ? "Sau khi duyệt, phiên bản này được xem là bản chốt." : "Hãy nêu lý do để nhà thiết kế biết cần sửa gì.";
    $("reasonField").style.display = kind === "approved" ? "none" : "";
    const r = $("decReason"); r.value = ""; r.required = kind !== "approved";
    r.setAttribute("aria-invalid", "false"); $("reasonField").querySelector(".field-error").textContent = "";
    CS.ui.openModal("decisionModal");
  }
  $("decisionForm").onsubmit = (e) => {
    e.preventDefault();
    if (pendingDecision !== "approved" && !CS.ui.validate($("decisionForm"))) return;
    const v = CS.store.get("versions", selected);
    const proj = CS.store.get("projects", pid);
    if (pendingDecision !== "approved" && revisionsUsed() >= proj.settings.maxRevisions) {
      CS.ui.closeModal("decisionModal"); CS.ui.toast("Dự án đã hết lượt chỉnh sửa.", "err"); renderDetail(); return;
    }
    CS.store.update("versions", v.id, { status: pendingDecision });
    if (pendingDecision !== "approved") {
      CS.store.update("projects", pid, { revisionsUsed: revisionsUsed() + 1 });
      CS.store.add("comments", { versionId: v.id, authorId: user.id, text: $("decReason").value.trim(), status: "open", internal: false, createdAt: CS.ui.today() });
    }
    CS.ui.closeModal("decisionModal");
    CS.ui.toast("Đã ghi nhận quyết định.", "ok");
    renderList(versionsOf()); renderDetail();
  };

  load();
})();
