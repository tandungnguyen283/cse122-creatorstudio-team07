(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let pid = CS.ui.getProjectId(user);
  let selected = null;
  let editingId = null;

  if (!pid) { CS.ui.state($("versionTable"), "empty", { icon: "📁", msg: "Bạn chưa được giao dự án nào." }); $("newVersion").disabled = true; return; }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; selected = null; load(); });

  function load() {
    CS.ui.state($("versionTable"), "loading");
    CS.api.list("versions", (v) => v.projectId === pid).then(() => { renderTable(); renderFeedback(); })
      .catch((e) => CS.ui.state($("versionTable"), "error", { msg: e.message, onRetry: load }));
  }

  function renderTable() {
    const f = $("statusFilter").value;
    const all = CS.store.list("versions").filter((v) => v.projectId === pid);
    const rows = all.filter((v) => (f ? v.status === f : v.status !== "archived")).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const host = $("versionTable");
    if (!all.length) { CS.ui.state(host, "empty", { icon: "🗂️", msg: "Chưa có phiên bản nào.", action: '<button class="btn primary" id="emptyNew">Tạo phiên bản đầu tiên</button>' }); $("emptyNew").onclick = () => openForm(); return; }
    if (!rows.length) { CS.ui.state(host, "empty", { icon: "🔎", msg: "Không có phiên bản ở trạng thái này." }); return; }
    host.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Bản</th><th>Ghi chú</th><th>Trạng thái</th><th>Ngày</th><th>Thao tác</th></tr></thead><tbody>` + rows.map((v) => {
      const open = CS.store.list("comments").filter((c) => c.versionId === v.id && c.status === "open").length;
      const editable = ["draft", "changes", "rejected"].includes(v.status);
      return `<tr class="${v.id === selected ? "sel" : ""}">
        <td><span class="swatch" style="display:inline-block;width:20px;height:20px;vertical-align:middle;background:${esc(v.color)}"></span> <strong>${esc(v.name)}</strong> ${v.isLatest ? '<span class="badge brand">Mới nhất</span>' : ""}</td>
        <td>${esc(v.note)}</td><td>${CS.ui.statusBadge(v.status)}</td><td>${CS.ui.fmtDate(v.createdAt)}</td>
        <td><div class="actions">
          <button class="btn sm" data-act="view" data-id="${v.id}">Góp ý${open ? " (" + open + ")" : ""}</button>
          ${editable ? `<button class="btn sm" data-act="edit" data-id="${v.id}">Sửa</button>` : ""}
          ${v.status === "draft" || v.status === "changes" || v.status === "rejected" ? `<button class="btn sm primary" data-act="send" data-id="${v.id}">Gửi review</button>` : ""}
          ${v.status === "archived" ? `<button class="btn sm" data-act="restore" data-id="${v.id}">Khôi phục</button>` : `<button class="btn sm" data-act="archive" data-id="${v.id}" ${v.status === "pending" ? 'disabled title="Đang chờ khách duyệt"' : ""}>Lưu trữ</button>`}
          ${v.status === "draft" ? `<button class="btn sm danger" data-act="delete" data-id="${v.id}">Xóa</button>` : ""}
        </div></td></tr>`;
    }).join("") + "</tbody></table></div>";
  }

  function renderFeedback() {
    const host = $("fbList");
    if (!selected) { host.innerHTML = ""; return; }
    const v = CS.store.get("versions", selected);
    if (!v) { selected = null; host.innerHTML = ""; return; }
    $("fbFor").textContent = "Góp ý cho " + v.name;
    const list = CS.store.list("comments").filter((c) => c.versionId === v.id);
    if (!list.length) { CS.ui.state(host, "empty", { icon: "💬", msg: "Chưa có góp ý cho phiên bản này." }); return; }
    host.innerHTML = list.map((c) => `<article class="comment"><header class="who">${esc(CS.ui.userName(c.authorId))} ${c.internal ? '<span class="badge brand">Nội bộ</span>' : ""} ${CS.ui.statusBadge(c.status)}</header>${esc(c.text)}
      <div class="actions" style="margin-top:.3rem"><button class="btn sm" data-toggle="${c.id}">${c.status === "open" ? "Đánh dấu đã xử lý" : "Mở lại"}</button></div></article>`).join("");
  }

  $("versionTable").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
    const id = b.dataset.id; const act = b.dataset.act;
    if (act === "view") { selected = id; renderTable(); renderFeedback(); }
    else if (act === "edit") openForm(id);
    else if (act === "send") { CS.store.update("versions", id, { status: "review" }); CS.ui.toast("Đã gửi cho Creative Lead review.", "ok"); renderTable(); }
    else if (act === "archive") { CS.store.update("versions", id, { status: "archived", isLatest: false }); CS.ui.toast("Đã lưu trữ phiên bản."); renderTable(); }
    else if (act === "restore") { CS.store.update("versions", id, { status: "draft" }); CS.ui.toast("Đã khôi phục về bản nháp.", "ok"); renderTable(); }
    else if (act === "delete") { if (CS.ui.confirm("Xóa bản nháp này?")) { CS.store.remove("versions", id); if (selected === id) selected = null; CS.ui.toast("Đã xóa."); renderTable(); renderFeedback(); } }
  });
  $("fbList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-toggle]"); if (!b) return;
    const c = CS.store.get("comments", b.dataset.toggle);
    CS.store.update("comments", c.id, { status: c.status === "open" ? "resolved" : "open" });
    renderFeedback(); renderTable();
  });
  $("statusFilter").addEventListener("change", renderTable);

  function openForm(id) {
    editingId = id || null;
    const f = $("versionForm"); f.reset();
    f.querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
    f.querySelectorAll("[aria-invalid]").forEach((x) => x.removeAttribute("aria-invalid"));
    $("vmTitle2").textContent = id ? "Sửa phiên bản" : "Phiên bản mới";
    if (id) { const v = CS.store.get("versions", id); $("vNote").value = v.note; $("vColor").value = v.color; }
    CS.ui.openModal("versionModal");
  }
  $("newVersion").onclick = () => openForm();
  $("versionForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("versionForm"))) return;
    const data = { note: $("vNote").value.trim(), color: $("vColor").value };
    if (editingId) { CS.store.update("versions", editingId, Object.assign(data, { status: "draft" })); CS.ui.toast("Đã cập nhật phiên bản.", "ok"); }
    else {
      const n = CS.store.list("versions").filter((v) => v.projectId === pid).length + 1;
      const rec = CS.store.add("versions", Object.assign(data, { projectId: pid, name: "v" + n, status: "draft", authorId: user.id, createdAt: CS.ui.today(), isLatest: false }));
      selected = rec.id; CS.ui.toast("Đã tạo " + rec.name + " (bản nháp).", "ok");
    }
    CS.ui.closeModal("versionModal"); renderTable(); renderFeedback();
  };

  load();
})();
