(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let pid = null;

  const users = (role) => CS.store.list("users").filter((u) => u.role === role && u.status === "active");
  const opts = (list, sel, blank) => (blank ? `<option value="">${blank}</option>` : "") + list.map((u) => `<option value="${u.id}" ${u.id === sel ? "selected" : ""}>${esc(u.name)}</option>`).join("");

  function refreshPicker() {
    const list = CS.store.list("projects");
    if (!pid || !list.find((p) => p.id === pid)) pid = list[0] && list[0].id;
    $("projectSelect").innerHTML = list.map((p) => `<option value="${p.id}" ${p.id === pid ? "selected" : ""}>${esc(p.name)}</option>`).join("");
    $("projectSelect").disabled = !list.length;
  }
  $("projectSelect").onchange = () => { pid = $("projectSelect").value; load(); };

  function load() {
    CS.ui.state($("area"), "loading");
    CS.api.list("projects").then(() => { refreshPicker(); render(); })
      .catch((e) => CS.ui.state($("area"), "error", { msg: e.message, onRetry: load }));
  }

  function render() {
    const p = pid && CS.store.get("projects", pid);
    if (!p) { CS.ui.state($("area"), "empty", { icon: "📁", msg: "Chưa có dự án nào.", action: '<button class="btn primary" id="emptyNew">Tạo dự án</button>' }); $("emptyNew").onclick = openNew; return; }
    const archived = p.status === "archived";
    $("area").innerHTML = `
      ${archived ? '<p class="alert warn">Dự án đã lưu trữ nên các thiết lập đang bị khóa. Hãy khôi phục để chỉnh sửa.</p>' : ""}
      <form class="card" id="setForm" novalidate>
        <fieldset ${archived ? "disabled" : ""} style="border:0;padding:0;margin:0">
        <h2>Thông tin chung ${CS.ui.statusBadge(p.status)}</h2>
        <div class="field"><label for="sName">Tên dự án *</label><input id="sName" type="text" value="${esc(p.name)}" required minlength="5"><small class="field-error"></small></div>
        <div class="form-row">
          <div class="field"><label for="sStatus">Trạng thái</label><select id="sStatus"><option value="active" ${p.status === "active" ? "selected" : ""}>Đang chạy</option><option value="paused" ${p.status === "paused" ? "selected" : ""}>Tạm dừng</option><option value="done" ${p.status === "done" ? "selected" : ""}>Hoàn thành</option></select></div>
          <div class="field"><label for="sDeadline">Hạn chót *</label><input id="sDeadline" type="date" value="${esc(p.deadline)}" required><small class="field-error"></small></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="sLead">Creative Lead *</label><select id="sLead" required>${opts(users("lead"), p.leadId, "— Chọn —")}</select><small class="field-error"></small></div>
          <div class="field"><label for="sDesigner">Nhà thiết kế</label><select id="sDesigner">${opts(users("designer"), p.designerId, "— Chưa phân công —")}</select></div>
        </div>

        <h2 style="margin-top:.5rem">Quy tắc duyệt</h2>
        <label class="switch"><input type="checkbox" id="sComments" ${p.settings.allowComments ? "checked" : ""}> Cho phép khách hàng góp ý</label>
        <label class="switch"><input type="checkbox" id="sApproval" ${p.settings.requireApproval ? "checked" : ""}> Bắt buộc khách duyệt trước khi chốt</label>
        <label class="switch"><input type="checkbox" id="sNotify" ${p.settings.notifyEmail ? "checked" : ""}> Gửi thông báo email khi có phiên bản mới</label>
        <div class="field" style="max-width:240px;margin-top:.7rem"><label for="sRev">Số lượt chỉnh sửa tối đa (1–10)</label><input id="sRev" type="number" min="1" max="10" value="${p.settings.maxRevisions}" style="width:100%;font:inherit;padding:.55rem .7rem;border:1px solid #cfcbc2;border-radius:8px"><small class="field-error"></small></div>
        <div class="actions"><button class="btn primary" type="submit">Lưu thay đổi</button></div>
        </fieldset>
      </form>

      <section class="card" style="border-color:#f1b8b2">
        <h2>Lưu trữ &amp; xóa</h2>
        <div class="actions">
          ${archived ? '<button class="btn" id="restoreBtn">Khôi phục dự án</button>' : '<button class="btn" id="archiveBtn">Lưu trữ dự án</button>'}
          <button class="btn danger" id="deleteBtn">Xóa vĩnh viễn</button>
        </div>
      </section>`;
    wire(p);
  }

  function wire(p) {
    const f = $("setForm");
    f.onsubmit = (e) => {
      e.preventDefault();
      if (!CS.ui.validate(f)) return;
      const rev = Number($("sRev").value);
      if (!Number.isInteger(rev) || rev < 1 || rev > 10) {
        $("sRev").setAttribute("aria-invalid", "true"); $("sRev").parentElement.querySelector(".field-error").textContent = "Nhập số nguyên từ 1 đến 10."; $("sRev").focus(); return;
      }
      CS.store.update("projects", p.id, {
        name: $("sName").value.trim(), status: $("sStatus").value, deadline: $("sDeadline").value, leadId: $("sLead").value, designerId: $("sDesigner").value || null,
        settings: { allowComments: $("sComments").checked, requireApproval: $("sApproval").checked, notifyEmail: $("sNotify").checked, maxRevisions: rev }
      });
      CS.ui.toast("Đã lưu cài đặt dự án.", "ok"); refreshPicker(); render();
    };
    const a = $("archiveBtn"), r = $("restoreBtn");
    if (a) a.onclick = () => { if (CS.ui.confirm("Lưu trữ dự án này?")) { CS.store.update("projects", p.id, { status: "archived" }); CS.ui.toast("Đã lưu trữ dự án."); render(); } };
    if (r) r.onclick = () => { CS.store.update("projects", p.id, { status: "active" }); CS.ui.toast("Đã khôi phục dự án.", "ok"); render(); };
    $("deleteBtn").onclick = () => {
      const typed = window.prompt('Gõ đúng tên dự án để xác nhận xóa vĩnh viễn:\n' + p.name);
      if (typed === null) return;
      if (typed.trim() !== p.name) { CS.ui.toast("Tên không khớp, chưa xóa.", "err"); return; }
      CS.store.list("versions").filter((x) => x.projectId === p.id).forEach((v) => CS.store.list("comments").filter((c) => c.versionId === v.id).forEach((c) => CS.store.remove("comments", c.id)));
      ["briefs", "versions", "tasks", "moodboards"].forEach((ent) => CS.store.list(ent).filter((x) => x.projectId === p.id).forEach((x) => CS.store.remove(ent, x.id)));
      CS.store.remove("projects", p.id); CS.ui.toast("Đã xóa dự án."); pid = null; refreshPicker(); render();
    };
  }

  function openNew() {
    $("newForm").reset();
    $("newForm").querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
    $("nClient").innerHTML = opts(users("client"), "", "— Chọn —");
    CS.ui.openModal("newModal");
  }
  $("newProject").onclick = openNew;
  $("newForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("newForm"))) return;
    const rec = CS.store.add("projects", {
      name: $("nName").value.trim(), clientId: $("nClient").value, leadId: (users("lead")[0] || {}).id || "", designerId: null, status: "active", deadline: $("nDeadline").value,
      description: "", settings: { allowComments: true, requireApproval: true, notifyEmail: true, maxRevisions: 3 }
    });
    pid = rec.id; CS.ui.closeModal("newModal"); CS.ui.toast("Đã tạo dự án.", "ok"); refreshPicker(); render();
  };

  load();
})();
