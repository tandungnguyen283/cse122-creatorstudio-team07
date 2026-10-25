(function () {
  const user = CS.ui.init();
  if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let editingId = null;

  function render() {
    const host = $("tplList");
    CS.ui.state(host, "loading");
    CS.api
      .list("templates")
      .then((all) => {
        const q = $("q").value.trim().toLowerCase();
        const st = $("stFilter").value;
        const rows = all.filter(
          (t) =>
            (!q || t.name.toLowerCase().includes(q)) &&
            (!st || (st === "on") === t.active),
        );
        if (!all.length) {
          CS.ui.state(host, "empty", {
            icon: "🧩",
            msg: "Chưa có template nào.",
            action:
              '<button class="btn primary" id="emptyNew">Tạo template đầu tiên</button>',
          });
          $("emptyNew").onclick = () => openForm();
          return;
        }
        if (!rows.length) {
          CS.ui.state(host, "empty", {
            icon: "🔎",
            msg: "Không có template phù hợp.",
          });
          return;
        }
        host.innerHTML =
          '<div class="grid auto">' +
          rows
            .map(
              (t) => `
        <article class="card" aria-label="${esc(t.name)}">
          <header style="display:flex;justify-content:space-between;gap:.5rem"><h3>${esc(t.name)}</h3>${t.active ? '<span class="badge ok">Đang dùng</span>' : '<span class="badge err">Vô hiệu hóa</span>'}</header>
          <ul class="chips" style="margin:.5rem 0">${t.fields.map((f) => `<li><span class="badge brand">${esc(f)}</span></li>`).join("")}</ul>
          <div class="actions">
            <button class="btn sm" data-act="edit" data-id="${t.id}">Sửa</button>
            <button class="btn sm" data-act="toggle" data-id="${t.id}">${t.active ? "Vô hiệu hóa" : "Kích hoạt"}</button>
            <button class="btn sm danger" data-act="delete" data-id="${t.id}">Xóa</button>
          </div></article>`,
            )
            .join("") +
          "</div>";
      })
      .catch((e) =>
        CS.ui.state(host, "error", { msg: e.message, onRetry: render }),
      );
  }

  $("tplList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const id = b.dataset.id;
    const t = CS.store.get("templates", id);
    if (b.dataset.act === "edit") openForm(id);
    else if (b.dataset.act === "toggle") {
      CS.store.update("templates", id, { active: !t.active });
      CS.ui.toast(
        t.active ? "Đã vô hiệu hóa template." : "Đã kích hoạt template.",
        "ok",
      );
      render();
    } else if (
      b.dataset.act === "delete" &&
      CS.ui.confirm('Xóa template "' + t.name + '"?')
    ) {
      CS.store.remove("templates", id);
      CS.ui.toast("Đã xóa template.");
      render();
    }
  });

  function openForm(id) {
    editingId = id || null;
    const f = $("tplForm");
    f.reset();
    f.querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
    f.querySelectorAll("[aria-invalid]").forEach((x) =>
      x.removeAttribute("aria-invalid"),
    );
    $("tmTitle").textContent = id ? "Sửa template" : "Template mới";
    if (id) {
      const t = CS.store.get("templates", id);
      $("tName").value = t.name;
      $("tFields").value = t.fields.join(", ");
    }
    CS.ui.openModal("tplModal");
  }

  $("newTpl").onclick = () => openForm();
  $("tplForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("tplForm"))) return;
    const fields = $("tFields")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (fields.length < 2) {
      $("tFields").setAttribute("aria-invalid", "true");
      $("tFields").parentElement.querySelector(".field-error").textContent =
        "Cần ít nhất 2 trường.";
      $("tFields").focus();
      return;
    }
    const dup = CS.store
      .list("templates")
      .some(
        (t) =>
          t.id !== editingId &&
          t.name.toLowerCase() === $("tName").value.trim().toLowerCase(),
      );
    if (dup) {
      $("tName").setAttribute("aria-invalid", "true");
      $("tName").parentElement.querySelector(".field-error").textContent =
        "Tên template đã tồn tại.";
      $("tName").focus();
      return;
    }
    const data = { name: $("tName").value.trim(), fields };
    if (editingId) CS.store.update("templates", editingId, data);
    else CS.store.add("templates", Object.assign(data, { active: true }));
    CS.ui.closeModal("tplModal");
    CS.ui.toast(editingId ? "Đã cập nhật template." : "Đã tạo template.", "ok");
    render();
  };
  $("q").addEventListener("input", render);
  $("stFilter").addEventListener("change", render);
  render();
})();
