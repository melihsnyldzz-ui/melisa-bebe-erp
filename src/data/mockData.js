import {
  AlertTriangle,
  ArrowDownToLine,
  Banknote,
  Boxes,
  ChartNoAxesColumnIncreasing,
  CreditCard,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  Settings,
  ShoppingBag,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const menuItems = [
  { id: "dashboard", label: "Ana Panel", icon: LayoutDashboard },
  { id: "products", label: "Ürünler", icon: PackageSearch },
  { id: "customers", label: "Müşteriler", icon: UsersRound },
  { id: "suppliers", label: "Tedarikçiler", icon: Truck },
  { id: "purchase-slips", label: "Alış Fişleri", icon: ReceiptText },
  { id: "sales-slips", label: "Satış Fişleri", icon: ShoppingBag },
  { id: "collections", label: "Tahsilatlar", icon: Banknote },
  { id: "payments", label: "Ödemeler", icon: CreditCard },
  { id: "stock-movements", label: "Stok Hareketleri", icon: Boxes },
  { id: "reports", label: "Raporlar", icon: ChartNoAxesColumnIncreasing },
  { id: "settings", label: "Ayarlar", icon: Settings },
];

export const kpis = [
  { label: "Bugünkü Satış", value: "125.000 TL", icon: ShoppingBag, tone: "red" },
  { label: "Bugünkü Tahsilat", value: "72.000 TL", icon: Banknote, tone: "green" },
  { label: "Bugünkü Alış", value: "94.000 TL", icon: Truck, tone: "dark" },
  { label: "Bugünkü Tedarikçi Ödemesi", value: "40.000 TL", icon: CreditCard, tone: "amber" },
  { label: "Toplam Müşteri Alacağı", value: "1.240.000 TL", icon: WalletCards, tone: "red" },
  { label: "Toplam Tedarikçi Borcu", value: "890.000 TL", icon: ArrowDownToLine, tone: "dark" },
  { label: "Toplam Stok Adedi", value: "18.450", icon: Boxes, tone: "green" },
  { label: "Kritik Stok Ürün Sayısı", value: "37", icon: AlertTriangle, tone: "amber" },
];

export const salesChart = [
  { day: "Pzt", value: 82000 },
  { day: "Sal", value: 96000 },
  { day: "Çar", value: 74000 },
  { day: "Per", value: 110000 },
  { day: "Cum", value: 125000 },
  { day: "Cmt", value: 118000 },
  { day: "Paz", value: 103000 },
];

export const topProducts = [
  { name: "Organik Body", adet: 245 },
  { name: "Pamuk Tulum", adet: 218 },
  { name: "Bebek Seti", adet: 176 },
  { name: "Uyku Tulumu", adet: 142 },
  { name: "Patikli Alt", adet: 119 },
];

export const tables = {
  sales: [
    ["SF-10245", "Ayşe Yılmaz", "18.450 TL", "11:42"],
    ["SF-10244", "MiniModa", "12.900 TL", "10:58"],
    ["SF-10243", "Ece Tekstil", "8.320 TL", "10:21"],
  ],
  purchases: [
    ["AF-6812", "Pamukhan Tekstil", "42.000 TL", "09:55"],
    ["AF-6811", "Bursa Örme", "31.250 TL", "Dün"],
    ["AF-6810", "Mira Aksesuar", "20.750 TL", "Dün"],
  ],
  collections: [
    ["TH-3509", "Deniz Kids", "28.000 TL", "Nakit"],
    ["TH-3508", "Ayşe Yılmaz", "16.500 TL", "Havale"],
    ["TH-3507", "MiniModa", "27.500 TL", "Kart"],
  ],
  stock: [
    ["MB-0142", "Yenidoğan Body 0-3 Ay", "4 adet", "Acil"],
    ["MB-0278", "Kız Bebek Tulum 6-9 Ay", "7 adet", "Kritik"],
    ["MB-0315", "Pamuk Battaniye", "9 adet", "Takip"],
  ],
  risk: [
    ["Ece Tekstil", "184.000 TL", "24 gün", "Yüksek"],
    ["Deniz Kids", "132.500 TL", "18 gün", "Orta"],
    ["Minik Adımlar", "96.750 TL", "15 gün", "Orta"],
  ],
};
