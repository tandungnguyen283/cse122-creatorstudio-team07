(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let editingId = null;

  function progress(p) {
    const vs = CS.store.list("versions").filter((v) => v.projectId === p.id);
    const latest = vs.find((v) => v.isLatest);
    const tasks = CS.store.list("tasks").filter((t) => t.projectId === p.id && !t.archived);
    const done = tasks.filter((t) => t.status === "done").length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const brief = CS.store.list("briefs").filter((b) => b.projectId === p.id && b.status !== "archived").sort((a, b) => ((a.createdAt || "") < (b.createdAt || "") ? 1 : -1))[0];
    return { latest, pct, tasks: tasks.length, brief, openComments: latest ? CS.store.list("comments").filter((c) => c.versionId === latest.id && !c.internal && c.status === "open").length : 0 };
  }

  function stats(list) {
    const waiting = list.filter((p) => { const l = progress(p).latest; return l && l.status === "pending"; }).length;
    const items = [
      [list.length, "Tổng dự án"], [list.filter((p) => p.status === "active").length, "Đang chạy"],
      [waiting, "Phiên bản chờ bạn duyệt"], [list.filter((p) => p.status === "archived").length, "Đã lưu trữ"]
    ];
    $("stats").innerHTML = items.map(([n, l]) => `<article class="card stat"><p class="num">${n}</p><p class="lbl">${l}</p></article>`).join("");
  }

  let cache = null;   // danh sách dự án đã tải, dùng để lọc ngay không cần tải lại
  let reqId = 0;      // bỏ qua kết quả của yêu cầu cũ khi có yêu cầu mới

  /* Cùng quy tắc hiển thị dự án với các trang khác (projectsFor), tránh lệch khi đổi vai trò */
  function visible(p) { return CS.ui.projectsFor(user).some((x) => x.id === p.id); }

  function draw() {
    const host = $("projectList");
    const all = cache;
    stats(all);
    const q = $("q").value.trim().toLowerCase(); const st = $("statusFilter").value;
    const rows = all.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (!st || p.status === st));
    if (!all.length) { CS.ui.state(host, "empty", { icon: "📁", msg: "Bạn chưa có dự án nào.", action: '<button class="btn primary" id="emptyNew">Tạo dự án đầu tiên</button>' }); $("emptyNew").onclick = () => openForm(); return; }
    if (!rows.length) { CS.ui.state(host, "empty", { icon: "🔎", msg: "Không có dự án phù hợp với bộ lọc." }); return; }
    host.innerHTML = '<div class="grid auto">' + rows.map(card).join("") + "</div>";
  }

  function render() {
    const host = $("projectList");
    const my = ++reqId;
    CS.ui.state(host, "loading");
    CS.api.list("projects", visible).then((all) => {
      if (my !== reqId) return;
      cache = all; draw();
    }).catch((e) => { if (my === reqId) CS.ui.state(host, "error", { msg: e.message, onRetry: render }); });
  }

  function card(p) {
    const g = progress(p);
    const archived = p.status === "archived";
    return `<article class="card" aria-label="${esc(p.name)}">
      <header style="display:flex;justify-content:space-between;gap:.5rem"><h3>${esc(p.name)}</h3>${CS.ui.statusBadge(p.status)}</header>
      <p style="color:var(--muted);font-size:.9rem">${esc(p.description)}</p>
      <ul style="list-style:none;padding:0;margin:0 0 .6rem;font-size:.86rem">
        <li>Hạn chót: <strong>${CS.ui.fmtDate(p.deadline)}</strong></li>
        <li>Brief: ${g.brief ? CS.ui.statusBadge(g.brief.status) : '<span class="badge">Chưa có</span>'}</li>
        <li>Phiên bản mới nhất: ${g.latest ? esc(g.latest.name) + " " + CS.ui.statusBadge(g.latest.status) : '<span class="badge">Chưa có</span>'}</li>
        <li>Góp ý đang mở: ${g.openComments}</li>
      </ul>
      <p class="confidence" style="width:100%" aria-label="Tiến độ công việc ${g.pct}%"><span class="bar" style="flex:1"><i style="width:${g.pct}%"></i></span> ${g.pct}% (${g.tasks} việc)</p>
      <div class="actions" style="margin-top:.7rem">
        <a class="btn sm" href="client-review-versions.html" data-open="${p.id}">Duyệt</a>
        <button class="btn sm" data-act="edit" data-id="${p.id}" aria-label="Sửa dự án ${esc(p.name)}" ${archived ? "disabled" : ""}>Sửa</button>
        ${archived ? `<button class="btn sm" data-act="restore" data-id="${p.id}" aria-label="Khôi phục dự án ${esc(p.name)}">Khôi phục</button>` : `<button class="btn sm" data-act="archive" data-id="${p.id}" aria-label="Lưu trữ dự án ${esc(p.name)}">Lưu trữ</button>`}
        <button class="btn sm danger" data-act="delete" data-id="${p.id}" aria-label="Xóa dự án ${esc(p.name)}">Xóa</button>
      </div></article>`;
  }

  $("projectList").addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]"); if (open) { CS.ui.setProjectId(open.dataset.open); return; }
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.act === "edit") openForm(id);
    else if (b.dataset.act === "archive") { CS.store.update("projects", id, { status: "archived" }); CS.ui.toast("Đã lưu trữ dự án."); render(); }
    else if (b.dataset.act === "restore") { CS.store.update("projects", id, { status: "active" }); CS.ui.toast("Đã khôi phục dự án.", "ok"); render(); }
    else if (b.dataset.act === "delete") {
      const approved = CS.store.list("versions").some((x) => x.projectId === id && x.status === "approved");
      const msg = approved
        ? "Dự án này có phiên bản ĐÃ DUYỆT. Xóa sẽ mất toàn bộ phiên bản, brief và góp ý, không thể hoàn tác. Bạn nên chọn Lưu trữ thay vì Xóa. Vẫn xóa?"
        : "Xóa dự án này? Thao tác không thể hoàn tác.";
      if (CS.ui.confirm(msg)) {
        CS.store.list("versions").filter((x) => x.projectId === id).forEach((v) => CS.store.list("comments").filter((c) => c.versionId === v.id).forEach((c) => CS.store.remove("comments", c.id)));
        ["briefs", "versions", "tasks", "moodboards"].forEach((ent) => CS.store.list(ent).filter((x) => x.projectId === id).forEach((x) => CS.store.remove(ent, x.id)));
        CS.store.remove("projects", id); CS.ui.toast("Đã xóa dự án."); render();
      }
    }
  });

  function openForm(id) {
    editingId = id || null;
    const f = $("projectForm"); f.reset();
    f.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
    f.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
    $("pmTitle").textContent = id ? "Sửa dự án" : "Tạo dự án";
    /* data-orig: hạn chót gốc được phép giữ nguyên dù đã qua, để vẫn sửa được tên/mô tả dự án cũ */
    delete $("pDeadline").dataset.orig;
    if (id) { const p = CS.store.get("projects", id); $("pName").value = p.name; $("pDesc").value = p.description; $("pDeadline").value = p.deadline; $("pDeadline").dataset.orig = p.deadline; }
    CS.ui.openModal("projectModal");
  }
  $("newProject").onclick = () => openForm();
  $("projectForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("projectForm"))) return;
    const data = { name: $("pName").value.trim(), description: $("pDesc").value.trim(), deadline: $("pDeadline").value };
    if (editingId) CS.store.update("projects", editingId, data);
    else { const rec = CS.store.add("projects", Object.assign(data, { clientId: user.id, leadId: "u3", designerId: null, status: "active", settings: { allowComments: true, requireApproval: true, notifyEmail: true, maxRevisions: 3 } }));
      CS.ui.setProjectId(rec.id); /* dự án mới thành dự án đang chọn ở các trang khác */ }
    CS.ui.closeModal("projectModal"); CS.ui.toast(editingId ? "Đã cập nhật dự án." : "Đã tạo dự án.", "ok"); render();
  };
  /* Lọc trên dữ liệu đã có: không hiện skeleton/độ trễ mỗi lần gõ phím */
  $("q").addEventListener("input", () => { if (cache) draw(); });
  $("statusFilter").addEventListener("change", () => { if (cache) draw(); });
  render();
})();
