/* Dữ liệu giả lập ban đầu (seed). Toàn bộ dữ liệu nghiệp vụ nằm ở đây, không viết cứng trong HTML. */
window.CS = window.CS || {};

CS.SEED = {
  users: [
    { id: "u1", name: "Lan Anh", email: "client@demo.vn", role: "client", status: "active", company: "Hoa Sen Studio" },
    { id: "u2", name: "Minh Quân", email: "designer@demo.vn", role: "designer", status: "active" },
    { id: "u3", name: "Thu Hà", email: "lead@demo.vn", role: "lead", status: "active" },
    { id: "u4", name: "Quản trị viên", email: "admin@demo.vn", role: "admin", status: "active" },
    { id: "u5", name: "Gia Bảo", email: "bao@demo.vn", role: "designer", status: "active" },
    { id: "u6", name: "Công ty Trà Việt", email: "travet@demo.vn", role: "client", status: "disabled", company: "Trà Việt" }
  ],

  projects: [
    { id: "p1", name: "Nhận diện thương hiệu Hoa Sen", clientId: "u1", leadId: "u3", designerId: "u2", status: "active", deadline: "2026-11-15",
      description: "Bộ nhận diện gồm logo, bảng màu và ấn phẩm cơ bản.", settings: { allowComments: true, requireApproval: true, notifyEmail: true, maxRevisions: 3 } },
    { id: "p2", name: "Poster triển lãm Sắc Việt", clientId: "u1", leadId: "u3", designerId: "u5", status: "paused", deadline: "2026-12-01",
      description: "Poster A2 và bộ banner mạng xã hội.", settings: { allowComments: true, requireApproval: true, notifyEmail: false, maxRevisions: 2 } },
    { id: "p3", name: "Bao bì trà Việt", clientId: "u6", leadId: "u3", designerId: "u2", status: "archived", deadline: "2026-08-20",
      description: "Thiết kế hộp trà 3 dòng sản phẩm.", settings: { allowComments: false, requireApproval: true, notifyEmail: false, maxRevisions: 2 } }
  ],

  briefs: [
    { id: "b1", projectId: "p1", title: "Brief nhận diện Hoa Sen", goal: "Tạo bộ nhận diện hiện đại, gần gũi cho quán cà phê.",
      audience: "Sinh viên và nhân viên văn phòng 18–35 tuổi", deliverables: ["Logo", "Bảng màu", "Danh thiếp"],
      style: ["tối giản", "ấm áp"], budget: "20.000.000", deadline: "2026-11-15", status: "approved", createdBy: "u1", createdAt: "2026-10-01T08:00:00.000Z" },
    { id: "b2", projectId: "p2", title: "Brief poster Sắc Việt", goal: "Poster thu hút khách tham quan triển lãm.",
      audience: "Giới trẻ yêu nghệ thuật", deliverables: ["Poster A2", "Banner"], style: ["rực rỡ"], budget: "8.000.000",
      deadline: "2026-12-01", status: "submitted", createdBy: "u1", createdAt: "2026-10-03T08:00:00.000Z" }
  ],

  moodboards: [
    { id: "m1", projectId: "p1", title: "Hoa Sen – hướng ấm áp", keywords: ["tối giản", "ấm áp", "thủ công"],
      palette: ["#d9a5b3", "#f2e2d0", "#6b8f71", "#3b2f2f"], status: "published",
      items: [{ id: "i1", label: "Nét vẽ tay", color: "#d9a5b3" }, { id: "i2", label: "Giấy kraft", color: "#c9a77c" }, { id: "i3", label: "Lá sen", color: "#6b8f71" }] }
  ],

  versions: [
    { id: "v1", projectId: "p1", name: "v1", note: "Bản logo thô, 2 hướng ý tưởng.", color: "#d9a5b3", status: "changes", authorId: "u2", createdAt: "2026-10-01", isLatest: false },
    { id: "v2", projectId: "p1", name: "v2", note: "Chỉnh lại màu và khoảng cách chữ.", color: "#b9785f", status: "rejected", authorId: "u2", createdAt: "2026-10-05", isLatest: false },
    { id: "v3", projectId: "p1", name: "v3", note: "Thêm biến thể logo đen trắng.", color: "#6b8f71", status: "pending", authorId: "u2", createdAt: "2026-10-09", isLatest: true },
    { id: "v4", projectId: "p2", name: "v1", note: "Bố cục poster lần đầu.", color: "#e07a3f", status: "review", authorId: "u5", createdAt: "2026-10-08", isLatest: false }
  ],

  comments: [
    { id: "c1", versionId: "v3", authorId: "u1", text: "Màu xanh hơi tối, mong sáng hơn một chút.", status: "open", internal: false, createdAt: "2026-10-10" },
    { id: "c2", versionId: "v3", authorId: "u1", text: "Cần thêm phiên bản logo ngang cho biển hiệu.", status: "open", internal: false, createdAt: "2026-10-10" },
    { id: "c3", versionId: "v3", authorId: "u3", text: "Nội bộ: khoảng cách chữ ở biến thể đen trắng chưa đều.", status: "open", internal: true, createdAt: "2026-10-10" },
    { id: "c4", versionId: "v2", authorId: "u1", text: "Màu chưa đúng tinh thần ấm áp.", status: "resolved", internal: false, createdAt: "2026-10-06" }
  ],

  tasks: [
    { id: "t1", projectId: "p1", title: "Sửa màu xanh sáng hơn ở v3", assigneeId: "u2", status: "doing", priority: "high", due: "2026-10-14", archived: false },
    { id: "t2", projectId: "p1", title: "Thiết kế logo ngang cho biển hiệu", assigneeId: "u2", status: "todo", priority: "medium", due: "2026-10-17", archived: false },
    { id: "t3", projectId: "p1", title: "Chuẩn bị file giao danh thiếp", assigneeId: "u5", status: "todo", priority: "low", due: "2026-10-25", archived: false },
    { id: "t4", projectId: "p1", title: "Rà soát bảng màu v2", assigneeId: "u3", status: "done", priority: "medium", due: "2026-10-06", archived: false },
    { id: "t5", projectId: "p2", title: "Dàn trang poster A2", assigneeId: "u5", status: "review", priority: "high", due: "2026-10-15", archived: false }
  ],

  templates: [
    { id: "tp1", name: "Brief nhận diện thương hiệu", fields: ["Mục tiêu", "Đối tượng", "Sản phẩm bàn giao", "Phong cách", "Ngân sách", "Hạn chót"], active: true },
    { id: "tp2", name: "Brief ấn phẩm in", fields: ["Mục tiêu", "Kích thước", "Số lượng", "Hạn chót"], active: true },
    { id: "tp3", name: "Brief mạng xã hội (cũ)", fields: ["Kênh", "Thông điệp"], active: false }
  ]
};

/* Dữ liệu cho các mô phỏng AI (theo quy tắc, không cần máy chủ) */
CS.AIDATA = {
  styleLexicon: {
    "tối giản": ["minimal", "khoảng trắng", "đường nét mảnh", "sans-serif"],
    "ấm áp": ["tông đất", "kem", "cam nhạt", "thủ công"],
    "hiện đại": ["hình khối rõ", "tương phản", "lưới chặt", "chữ không chân"],
    "rực rỡ": ["màu bão hòa", "gradient", "tương phản mạnh", "năng động"],
    "sang trọng": ["vàng đồng", "đen nhám", "chữ có chân", "chi tiết tinh"],
    "tự nhiên": ["xanh lá", "họa tiết lá", "giấy tái chế", "organic"],
    "cổ điển": ["sepia", "viền hoa văn", "chữ serif", "retro"],
    "trẻ trung": ["pastel", "bo tròn", "minh họa vui", "icon"]
  },
  deliverableWords: { logo: "Logo", "danh thiếp": "Danh thiếp", poster: "Poster", banner: "Banner", "bao bì": "Bao bì", website: "Website", "bảng màu": "Bảng màu", brochure: "Brochure", "menu": "Menu" },
  feedbackCues: {
    high: ["sai", "lỗi", "gấp", "phải", "bắt buộc", "chưa đúng", "cần thêm"],
    medium: ["nên", "mong", "đề xuất", "chỉnh", "sửa"],
    low: ["có thể", "nếu được", "tùy", "thêm nữa"]
  }
};
