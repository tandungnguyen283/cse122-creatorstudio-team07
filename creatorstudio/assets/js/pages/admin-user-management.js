(function () {
  const user = CS.ui.init();
  if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  let editingId = null;

  function render() {
    const host = $("userTable");
    CS.ui.state(host, "loading");
    CS.api
      .list("users")
      .then((all) => {
        const q = $("q").value.trim().toLowerCase();
        const r = $("roleFilter").value;
        const s = $("stFilter").value;
        const rows = all.filter(
          (u) =>
            (!q ||
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q)) &&
            (!r || u.role === r) &&
            (!s || u.status === s),
        );
        if (!rows.length) {
          CS.ui.state(host, "empty", {
            icon: "🔎",
            msg: "Không có người dùng phù hợp.",
          });
          return;
        }
        host.innerHTML =
          `<div class="table-wrap"><table><thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>` +
          rows
            .map((u) => {
              const self = u.id === user.id;
              return `<tr><td><strong>${esc(u.name)}</strong>${self ? ' <span class="badge brand">Bạn</span>' : ""}</td><td>${esc(u.email)}</td><td>${CS.ui.ROLE_LABEL[u.role]}</td><td>${CS.ui.statusBadge(u.status)}</td>
          <td><div class="actions"><button class="btn sm" data-act="edit" data-id="${u.id}">Sửa</button>
          <button class="btn sm ${u.status === "active" ? "danger" : ""}" data-act="toggle" data-id="${u.id}" ${self ? 'disabled title="Không thể vô hiệu hóa chính mình"' : ""}>${u.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}</button></div></td></tr>`;
            })
            .join("") +
          "</tbody></table></div>";
      })
      .catch((e) =>
        CS.ui.state(host, "error", { msg: e.message, onRetry: render }),
      );
  }

  $("userTable").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    const u = CS.store.get("users", b.dataset.id);
    if (b.dataset.act === "edit") openForm(u.id);
    else if (b.dataset.act === "toggle") {
      const next = u.status === "active" ? "disabled" : "active";
      if (
        next === "disabled" &&
        !CS.ui.confirm(
          "Vô hiệu hóa " + u.name + "? Họ sẽ không đăng nhập được.",
        )
      )
        return;
      CS.store.update("users", u.id, { status: next });
      CS.ui.toast(
        next === "disabled"
          ? "Đã vô hiệu hóa tài khoản."
          : "Đã kích hoạt tài khoản.",
        "ok",
      );
      render();
    }
  });

  function openForm(id) {
    editingId = id || null;
    const f = $("userForm");
    f.reset();
    f.querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
    f.querySelectorAll("[aria-invalid]").forEach((x) =>
      x.removeAttribute("aria-invalid"),
    );
    $("umTitle").textContent = id ? "Sửa người dùng" : "Thêm người dùng";
    if (id) {
      const u = CS.store.get("users", id);
      $("uName").value = u.name;
      $("uEmail").value = u.email;
      $("uRole").value = u.role;
      $("uRole").disabled = id === user.id;
    } else $("uRole").disabled = false;
    CS.ui.openModal("userModal");
  }
  $("newUser").onclick = () => openForm();
  $("userForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("userForm"))) return;
    const email = $("uEmail").value.trim().toLowerCase();
    if (
      CS.store
        .list("users")
        .some((u) => u.id !== editingId && u.email.toLowerCase() === email)
    ) {
      $("uEmail").setAttribute("aria-invalid", "true");
      $("uEmail").parentElement.querySelector(".field-error").textContent =
        "Email này đã được sử dụng.";
      $("uEmail").focus();
      return;
    }
    const data = { name: $("uName").value.trim(), email };
    if (!$("uRole").disabled) data.role = $("uRole").value;
    if (editingId) CS.store.update("users", editingId, data);
    else CS.store.add("users", Object.assign(data, { status: "active" }));
    CS.ui.closeModal("userModal");
    CS.ui.toast(
      editingId ? "Đã cập nhật người dùng." : "Đã thêm người dùng.",
      "ok",
    );
    render();
  };
  $("q").addEventListener("input", render);
  $("roleFilter").addEventListener("change", render);
  $("stFilter").addEventListener("change", render);
  render();
})();
