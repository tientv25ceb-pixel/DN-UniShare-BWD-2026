export type Category = 'sach' | 'do-hoc-tap' | 'do-ktx' | 'suatan' | 'tailieu' | 'khac';
export type Condition = 'moi' | 'tot' | 'kha' | 'cu';
export type ExchangeType = 'mienphi' | 'traodoi' | 'sale' | 'lost' | 'found';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: Condition;
  exchangeType: ExchangeType;
  image: string;
  location: string;
  postedBy: string;
  posterAvatar?: string;
  posterFaculty?: string;
  createdAt: string;
  requestedCount: number;
  isFeatured?: boolean;
  posterId?: string;
  rawDescription?: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  lostDate?: string;
  reward?: string;
  contactPhone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  faculty: string;
  avatar?: string;
}

export interface Request {
  id: string;
  itemId: string;
  itemTitle: string;
  requesterId: string;
  requesterName: string;
  posterName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'collected';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  itemId: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export const CATEGORY_MAP: Record<Category, { label: string; emoji: string; bg: string }> = {
  'sach':       { label: 'Sách giáo trình', emoji: '📚', bg: 'cat-blue' },
  'do-hoc-tap': { label: 'Đồ học tập',     emoji: '🎓', bg: 'cat-green' },
  'do-ktx':     { label: 'Đồ KTX',         emoji: '🏠', bg: 'cat-amber' },
  'suatan':     { label: 'Suất ăn / Voucher', emoji: '🍜', bg: 'cat-rose' },
  'tailieu':    { label: 'Tài liệu',       emoji: '📄', bg: 'cat-purple' },
  'khac':       { label: 'Khác',            emoji: '📦', bg: 'cat-blue' }
};

export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [k, v.label])
) as Record<Category, string>;

export const CONDITION_LABELS: Record<Condition, string> = {
  'moi': 'Mới',
  'tot': 'Tốt',
  'kha': 'Khá',
  'cu': 'Cũ'
};

export const LOCATIONS = [
  'KTX Làng Đại học',
  'Thư viện ĐH Bách Khoa',
  'Cổng chính Làng Đại học',
  'Căn-tin ĐH Sư phạm',
  'Sảnh ĐH Kinh tế',
  'Thư viện ĐH Ngoại ngữ',
  'Khu tự học Làng Đại học',
  'Nhà ăn ĐH Bách Khoa',
];

// Sử dụng ảnh Unsplash chất lượng cao khớp thực tế với tên sản phẩm
const IMG = {
  bookCpp: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&h=400&q=80', // Lập trình / Công nghệ
  bookMath: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&h=400&q=80', // Giải tích / Toán học
  keyboard: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&h=400&q=80', // Bàn phím cơ Keychron
  fan: 'https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&w=600&h=400&q=80', // Quạt để bàn mini
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&h=400&q=80', // Suất ăn / Đồ ăn chất lượng
  rice: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&h=400&q=80', // Nồi cơm điện hiện đại
  mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&h=400&q=80', // Chuột máy tính không dây
  backpack: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&h=400&q=80', // Balo công nghệ cao cấp
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&h=400&q=80', // Đèn bàn học LED hiện đại
  docs: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80', // Tài liệu học tập / Thi cử
  coffee: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&h=400&q=80', // Cốc cafe chất lượng cao
  socket: 'https://images.unsplash.com/photo-1595787143151-e601da948ea8?auto=format&fit=crop&w=600&h=400&q=80'  // Ổ cắm điện đa năng
};

// 12 món đồ demo thực tế
export const mockItems: Item[] = [
  {
    id: '1',
    title: 'Giáo trình Lập trình C++ (CS161)',
    description: 'Sách giáo trình bản gốc, giữ cẩn thận không ghi chú bên trong. Rất cần cho các bạn CNTT năm 2. Mình tặng lại cho bạn nào thực sự cần.',
    category: 'sach',
    condition: 'tot',
    exchangeType: 'mienphi',
    image: IMG.bookCpp,
    location: 'Thư viện ĐH Bách Khoa',
    postedBy: 'Lê Hoàng Nam',
    posterFaculty: 'CNTT - ĐH Bách Khoa',
    createdAt: '2025-12-03',
    requestedCount: 7,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Bàn phím cơ Keychron K2 (Red switch)',
    description: 'Bàn phím cơ Keychron K2, switch Red gõ cực êm. Kết nối Bluetooth + USB. Phù hợp cho lập trình viên muốn trải nghiệm bàn phím cơ chất lượng.',
    category: 'do-hoc-tap',
    condition: 'tot',
    exchangeType: 'traodoi',
    image: IMG.keyboard,
    location: 'KTX Làng Đại học',
    postedBy: 'Trần Minh Đức',
    posterFaculty: 'CNTT - ĐH Bách Khoa',
    createdAt: '2025-12-05',
    requestedCount: 5,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Quạt mini USB sạc Type-C',
    description: 'Quạt mini USB 3 tốc độ, sạc Type-C. Nhỏ gọn, dùng ở KTX mùa hè cũng cần. Pin 2000mAh dùng được 6 tiếng liên tục.',
    category: 'do-ktx',
    condition: 'moi',
    exchangeType: 'mienphi',
    image: IMG.fan,
    location: 'Cổng chính Làng Đại học',
    postedBy: 'Lê Thị Hằng',
    posterFaculty: 'Kế toán - ĐH Kinh tế',
    createdAt: '2025-12-13',
    requestedCount: 12,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Suất cơm miễn phí tại nhà ăn ĐH Bách Khoa',
    description: 'Tặng 5 suất cơm miễn phí tại nhà ăn ĐH Bách Khoa cho sinh viên có hoàn cảnh khó khăn. Ưu tiên anh em sinh viên mới nhập học. Liên hệ để nhận voucher.',
    category: 'suatan',
    condition: 'moi',
    exchangeType: 'mienphi',
    image: IMG.food,
    location: 'Nhà ăn ĐH Bách Khoa',
    postedBy: 'Cộng đồng UniShare',
    posterFaculty: 'Ban điều hành',
    createdAt: '2025-12-14',
    requestedCount: 10,
    isFeatured: true
  },
  {
    id: '5',
    title: 'Nồi cơm điện mini 1.2L Sunhouse',
    description: 'Nồi cơm điện dùng tốt cho 1-2 người. Mình mới chuyển trọ nên không cần nữa. Tặng lại bạn nào ở KTX cần nấu cơm.',
    category: 'do-ktx',
    condition: 'kha',
    exchangeType: 'mienphi',
    image: IMG.rice,
    location: 'KTX Làng Đại học',
    postedBy: 'Nguyễn Minh Thư',
    posterFaculty: 'Sư phạm Toán - ĐH Sư phạm',
    createdAt: '2025-12-10',
    requestedCount: 8
  },
  {
    id: '6',
    title: 'Giáo trình Giải tích 1 (Toán cao cấp)',
    description: 'Sách Giải tích 1 bản tiếng Việt, có ghi chú giải bài tập ở cuối sách. Phù hợp cho sinh viên năm nhất khối ngành Kỹ thuật.',
    category: 'sach',
    condition: 'kha',
    exchangeType: 'mienphi',
    image: IMG.bookMath,
    location: 'Thư viện ĐH Bách Khoa',
    postedBy: 'Phạm Văn Hùng',
    posterFaculty: 'Cơ khí - ĐH Bách Khoa',
    createdAt: '2025-12-08',
    requestedCount: 4
  },
  {
    id: '7',
    title: 'Chuột không dây Logitech M331',
    description: 'Chuột Logitech M331 Silent Plus, dùng pin AA. Gần hết pin nhưng thay pin mới là dùng được. Muốn đổi lấy USB hub.',
    category: 'do-hoc-tap',
    condition: 'tot',
    exchangeType: 'traodoi',
    image: IMG.mouse,
    location: 'Khu tự học Làng Đại học',
    postedBy: 'Đặng Quốc Bảo',
    posterFaculty: 'ĐTVT - ĐH Bách Khoa',
    createdAt: '2025-12-07',
    requestedCount: 3
  },
  {
    id: '8',
    title: 'Balo laptop 15.6 inch Coolbell',
    description: 'Balo Coolbell chống nước, có ngăn laptop 15.6 inch riêng biệt. Dây kéo còn tốt, chỉ bị phai màu nhẹ phần đáy.',
    category: 'do-hoc-tap',
    condition: 'kha',
    exchangeType: 'mienphi',
    image: IMG.backpack,
    location: 'Căn-tin ĐH Sư phạm',
    postedBy: 'Trương Lan Anh',
    posterFaculty: 'Tiếng Anh - ĐH Ngoại ngữ',
    createdAt: '2025-12-06',
    requestedCount: 6
  },
  {
    id: '9',
    title: 'Đèn bàn LED chống cận Xiaomi',
    description: 'Đèn LED Xiaomi 3 chế độ sáng, sạc USB-C. Ánh sáng dịu mắt, rất phù hợp để học bài buổi tối tại KTX.',
    category: 'do-ktx',
    condition: 'tot',
    exchangeType: 'mienphi',
    image: IMG.lamp,
    location: 'KTX Làng Đại học',
    postedBy: 'Võ Thị Thanh',
    posterFaculty: 'Quản trị KD - ĐH Kinh tế',
    createdAt: '2025-12-04',
    requestedCount: 9
  },
  {
    id: '10',
    title: 'Tài liệu ôn thi TOEIC 600+',
    description: 'Bộ tài liệu ôn TOEIC bao gồm sách Economy 1-5 và bộ đề thi thật. In màu đẹp, có highlight từ vựng quan trọng.',
    category: 'tailieu',
    condition: 'tot',
    exchangeType: 'mienphi',
    image: IMG.docs,
    location: 'Thư viện ĐH Ngoại ngữ',
    postedBy: 'Hoàng Minh Tú',
    posterFaculty: 'Tiếng Nhật - ĐH Ngoại ngữ',
    createdAt: '2025-12-02',
    requestedCount: 15
  },
  {
    id: '11',
    title: 'Voucher Highland 50% (còn hạn)',
    description: 'Voucher giảm 50% tất cả đồ uống tại Highland Coffee. Hạn sử dụng đến 31/12/2025. Mình được tặng nhưng không uống cafe.',
    category: 'suatan',
    condition: 'moi',
    exchangeType: 'mienphi',
    image: IMG.coffee,
    location: 'Cổng chính Làng Đại học',
    postedBy: 'Phan Thị Hoa',
    posterFaculty: 'Du lịch - ĐH Kinh tế',
    createdAt: '2025-12-01',
    requestedCount: 20
  },
  {
    id: '12',
    title: 'Ổ cắm điện đa năng có USB',
    description: 'Ổ cắm điện 4 lỗ + 2 cổng USB. Dây 3m, rất tiện cho phòng KTX nhiều người dùng. Đã dùng 1 năm nhưng còn hoạt động tốt.',
    category: 'do-ktx',
    condition: 'kha',
    exchangeType: 'mienphi',
    image: IMG.socket,
    location: 'KTX Làng Đại học',
    postedBy: 'Nguyễn Đình Khoa',
    posterFaculty: 'Xây dựng - ĐH Bách Khoa',
    createdAt: '2025-11-28',
    requestedCount: 4
  }
];
