import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, User, ShoppingBag, ChevronLeft, ChevronRight,
  Instagram, Twitter, Facebook, Youtube, Menu, X,
  Plus, Minus, Trash2, ArrowLeft, Heart, Star,
  CheckCircle, Zap, Shield, Package, Truck, ChevronDown,
  LogOut, Eye, EyeOff, RefreshCw,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import veloxLogo from "@/imports/Logo_VELOX_orange.png";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const OG = "#E5521C";
const FONT = "'Montserrat', sans-serif";
const fmt = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, d => d === "đ" ? "d" : "D").toLowerCase();

/* ─────────────────────────────────────────────
   IMAGES
───────────────────────────────────────────── */
const IMG = {
  hero: "https://images.unsplash.com/photo-1744060204728-f68e434a3edf?w=1920&h=1080&fit=crop&auto=format",
  catMen: "https://images.unsplash.com/photo-1542321103-f277f1befb3c?w=700&h=950&fit=crop&auto=format",
  catWomen: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=700&h=950&fit=crop&auto=format",
  catGear: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?w=700&h=950&fit=crop&auto=format",
  p1: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop&auto=format",
  p2: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop&auto=format",
  p3: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop&auto=format",
  p4: "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?w=600&h=600&fit=crop&auto=format",
  i1: "https://images.unsplash.com/photo-1758521961238-bbb88f9ba45b?w=900&h=700&fit=crop&auto=format",
  i2: "https://images.unsplash.com/photo-1758521960740-47be01d168b0?w=500&h=400&fit=crop&auto=format",
  i3: "https://images.unsplash.com/photo-1758521959295-38ef00565e7c?w=500&h=400&fit=crop&auto=format",
  i4: "https://images.unsplash.com/photo-1727094141271-9bea5bc8c757?w=900&h=700&fit=crop&auto=format",
  i5: "https://images.unsplash.com/photo-1758521961330-2004fb10800f?w=500&h=400&fit=crop&auto=format",
  authBg: "https://images.unsplash.com/photo-1744060204728-f68e434a3edf?w=900&h=1200&fit=crop&auto=format",
  menBanner: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=1400&h=600&fit=crop&auto=format",
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Page = "home" | "shoes" | "products" | "about" | "product" | "checkout" | "success" | "auth" | "profile";
type AuthTab = "login" | "register" | "qr";
type User = { name: string; email: string; phone: string; provider: "email" | "facebook" | "google" | "tiktok"; joinDate: string; };
type Product = { id: number; name: string; categoryId: string; categoryVi: string; price: number; tag: string | null; img: string; desc: string; sizes: string[]; rating: number; reviews: number; };
type CartItem = Product & { qty: number; selectedSize: string };
type CheckoutForm = { name: string; email: string; phone: string; address: string; city: string; district: string; payment: "cod" | "bank" | "card"; };

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SHOE_CATS = [
  { id: "pho-thong", label: "Giày Phổ Thông", desc: "Phong cách thoải mái cho mọi hoạt động hàng ngày", img: IMG.p1, count: 18 },
  { id: "chay-bo", label: "Giày Chạy Bộ", desc: "Khí động học, đế EVA siêu nhẹ tối ưu hiệu suất", img: IMG.p2, count: 14 },
  { id: "da-bong", label: "Giày Đá Bóng", desc: "Bám sân tối ưu, kiểm soát bóng chính xác", img: IMG.p3, count: 10 },
  { id: "cau-long", label: "Giày Cầu Lông", desc: "Siêu nhẹ, ôm chân, hỗ trợ chuyển hướng nhanh", img: IMG.p4, count: 8 },
  { id: "truot-van", label: "Giày Trượt Ván", desc: "Đế cao su dày chống mài mòn cực bền", img: IMG.p1, count: 7 },
  { id: "gym", label: "Giày Tập Gym", desc: "Hỗ trợ mắt cá, bám tốt mọi bài tập cường độ cao", img: IMG.p2, count: 12 },
  { id: "leo-nui", label: "Giày Leo Núi", desc: "Chống thấm, bám đá vượt địa hình khắc nghiệt", img: IMG.p3, count: 6 },
  { id: "bong-ro", label: "Giày Bóng Rổ", desc: "Cổ cao bảo vệ mắt cá, đệm khí giảm chấn tối đa", img: IMG.p4, count: 9 },
];

const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "VELOX Sprint X1", categoryId: "chay-bo", categoryVi: "Giày Chạy Bộ", price: 2490000, tag: "MỚI", img: IMG.p1, desc: "Thiết kế khí động học, đế EVA siêu nhẹ giúp tối ưu hiệu suất mỗi bước chân.", sizes: ["38","39","40","41","42","43"], rating: 5, reviews: 128 },
  { id: 2, name: "VELOX Surge Pro", categoryId: "gym", categoryVi: "Giày Tập Gym", price: 2990000, tag: "BÁN CHẠY", img: IMG.p2, desc: "Công nghệ đệm ProFoam™ phân tán lực tác động, bảo vệ khớp trong mọi bài tập.", sizes: ["38","39","40","41","42","43","44"], rating: 5, reviews: 214 },
  { id: 3, name: "VELOX Phantom", categoryId: "chay-bo", categoryVi: "Giày Chạy Bộ", price: 1990000, tag: null, img: IMG.p3, desc: "Phần thân lưới thoáng khí kết hợp đế ngoài cao su bám đường vượt trội.", sizes: ["39","40","41","42","43"], rating: 4, reviews: 87 },
  { id: 4, name: "VELOX Drift", categoryId: "pho-thong", categoryVi: "Giày Phổ Thông", price: 1590000, tag: "MỚI", img: IMG.p4, desc: "Phong cách tối giản, linh hoạt từ gym ra đường phố với thiết kế đa năng.", sizes: ["38","39","40","41","42","43","44","45"], rating: 4, reviews: 63 },
  { id: 5, name: "VELOX Strike Pro", categoryId: "da-bong", categoryVi: "Giày Đá Bóng", price: 2190000, tag: "HOT", img: IMG.p1, desc: "Đinh TF bám sân nhân tạo, kiểm soát bóng chính xác với da tổng hợp cao cấp.", sizes: ["39","40","41","42","43"], rating: 4, reviews: 52 },
  { id: 6, name: "VELOX Wing", categoryId: "cau-long", categoryVi: "Giày Cầu Lông", price: 1790000, tag: null, img: IMG.p2, desc: "Siêu nhẹ chỉ 220g, ôm chân hoàn hảo, hỗ trợ chuyển hướng tức thì.", sizes: ["38","39","40","41","42","43"], rating: 5, reviews: 41 },
  { id: 7, name: "VELOX Grind", categoryId: "truot-van", categoryVi: "Giày Trượt Ván", price: 1690000, tag: null, img: IMG.p3, desc: "Đế cao su vulcanized 6mm chống mài mòn, bo mũi và gót tăng độ bền.", sizes: ["38","39","40","41","42","43","44"], rating: 4, reviews: 33 },
  { id: 8, name: "VELOX Summit", categoryId: "leo-nui", categoryVi: "Giày Leo Núi", price: 2790000, tag: "MỚI", img: IMG.p4, desc: "Chống thấm nước GORE-TEX, đế Vibram bám đá, cổ cao bảo vệ mắt cá.", sizes: ["39","40","41","42","43","44"], rating: 5, reviews: 29 },
  { id: 9, name: "VELOX Court King", categoryId: "bong-ro", categoryVi: "Giày Bóng Rổ", price: 2590000, tag: "HOT", img: IMG.p1, desc: "Cổ cao bảo vệ mắt cá, đệm khí Full-Air giảm chấn cực đại.", sizes: ["40","41","42","43","44","45"], rating: 5, reviews: 76 },
  { id: 10, name: "VELOX Apex Trainer", categoryId: "gym", categoryVi: "Giày Tập Gym", price: 2290000, tag: null, img: IMG.p2, desc: "Đế phẳng ổn định cho Squat và Deadlift, hỗ trợ mắt cá tối đa.", sizes: ["39","40","41","42","43","44"], rating: 4, reviews: 91 },
  { id: 11, name: "VELOX Classic Low", categoryId: "pho-thong", categoryVi: "Giày Phổ Thông", price: 1500000, tag: null, img: IMG.p3, desc: "Thiết kế cổ điển không bao giờ lỗi mốt, da PU cao cấp dễ vệ sinh.", sizes: ["38","39","40","41","42","43","44","45"], rating: 4, reviews: 155 },
  { id: 12, name: "VELOX Storm Runner", categoryId: "chay-bo", categoryVi: "Giày Chạy Bộ", price: 2890000, tag: "BÁN CHẠY", img: IMG.p4, desc: "Chống nước nhẹ, đế carbon plate tăng lực đẩy cho runner nghiêm túc.", sizes: ["38","39","40","41","42","43"], rating: 5, reviews: 182 },
];

/* ─────────────────────────────────────────────
   SPORTS ACCESSORIES DATA
───────────────────────────────────────────── */
const SIMG = {
  shirt:    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format",
  shorts:   "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop&auto=format",
  bottle:   "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop&auto=format",
  backpack: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format",
  gloves:   "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop&auto=format",
  towel:    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format",
  brandBg:  "https://images.unsplash.com/photo-1538388149542-5e24932d11a9?w=1920&h=800&fit=crop&auto=format",
};

const HERO_SLIDES = [
  { src: "https://images.unsplash.com/photo-1744060204728-f68e434a3edf?w=1920&h=1080&fit=crop&auto=format",   alt: "Vận động viên chạy sprint trong ánh nắng vàng" },
  { src: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=1920&h=1080&fit=crop&auto=format",   alt: "Vận động viên tập luyện cường độ cao" },
  { src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=1080&fit=crop&auto=format",   alt: "Bài tập sức bền và sức mạnh" },
  { src: "https://images.unsplash.com/photo-1542321103-f277f1befb3c?w=1920&h=1080&fit=crop&auto=format",      alt: "Phong cách sống thể thao VELOX" },
];

const SPORTS_CATS = [
  { id: "ao-the-thao",    label: "Áo Thể Thao",      desc: "Áo chạy bộ, tập gym, áo đá bóng siêu thoáng mát",  img: SIMG.shirt,    count: 15 },
  { id: "quan-the-thao",  label: "Quần Thể Thao",     desc: "Quần short, legging, quần tập co giãn 4 chiều",     img: SIMG.shorts,   count: 12 },
  { id: "binh-nuoc",      label: "Bình Nước",          desc: "Bình nước giữ nhiệt, chịu lực cao từ 500ml–2L",     img: SIMG.bottle,   count: 8  },
  { id: "ba-lo",          label: "Ba Lô Thể Thao",    desc: "Ba lô chạy bộ và gym chống thấm nước",             img: SIMG.backpack, count: 6  },
  { id: "gang-tay",       label: "Găng Tay Thể Thao", desc: "Găng tay gym, boxing, yoga đa năng",                img: SIMG.gloves,   count: 10 },
  { id: "phu-kien",       label: "Khăn & Phụ Kiện",  desc: "Khăn tập luyện, băng cổ tay, đồ bảo vệ hỗ trợ",    img: SIMG.towel,    count: 14 },
];

const SPORTS_PRODUCTS: Product[] = [
  { id: 101, name: "VELOX AirFit Tee",        categoryId: "ao-the-thao",   categoryVi: "Áo Thể Thao",      price: 390000,  tag: "MỚI",      img: SIMG.shirt,    desc: "Chất liệu Dry-Fit siêu thoáng mát, co giãn 4 chiều, phù hợp mọi hoạt động thể thao.", sizes: ["S","M","L","XL","XXL"],   rating: 5, reviews: 94  },
  { id: 102, name: "VELOX FlexRun Shorts",    categoryId: "quan-the-thao", categoryVi: "Quần Thể Thao",     price: 450000,  tag: "BÁN CHẠY", img: SIMG.shorts,   desc: "Quần short chạy bộ nhẹ thoáng khí, có túi khoá đựng điện thoại.",                      sizes: ["S","M","L","XL","XXL"],   rating: 5, reviews: 127 },
  { id: 103, name: "VELOX HydroMax 1L",       categoryId: "binh-nuoc",     categoryVi: "Bình Nước",         price: 290000,  tag: "MỚI",      img: SIMG.bottle,   desc: "Bình nước 1L giữ lạnh 24h, nắp chống rò rỉ tuyệt đối, thân chịu lực cao.",              sizes: ["1 Size"],                 rating: 4, reviews: 63  },
  { id: 104, name: "VELOX TrailPack 25L",     categoryId: "ba-lo",         categoryVi: "Ba Lô Thể Thao",   price: 890000,  tag: null,        img: SIMG.backpack, desc: "Ba lô 25L chống thấm, ngăn laptop 15 inch và ngăn đựng giày riêng biệt.",                  sizes: ["1 Size"],                 rating: 4, reviews: 41  },
  { id: 105, name: "VELOX PowerGrip Gloves",  categoryId: "gang-tay",      categoryVi: "Găng Tay Thể Thao", price: 320000,  tag: "HOT",      img: SIMG.gloves,   desc: "Găng tay gym đệm lòng bàn tay, thoáng khí, tăng lực bám tối đa khi tập luyện.",          sizes: ["S","M","L","XL"],         rating: 5, reviews: 88  },
  { id: 106, name: "VELOX QuickDry Towel",    categoryId: "phu-kien",      categoryVi: "Khăn & Phụ Kiện",  price: 180000,  tag: null,        img: SIMG.towel,    desc: "Khăn tập luyện siêu thấm hút, khô nhanh, kháng khuẩn tự nhiên.",                         sizes: ["1 Size"],                 rating: 4, reviews: 52  },
  { id: 107, name: "VELOX CoreFit Tank",      categoryId: "ao-the-thao",   categoryVi: "Áo Thể Thao",      price: 350000,  tag: null,        img: SIMG.shirt,    desc: "Áo ba lỗ tập gym sát người, thấm mồ hôi cực tốt, phối màu thể thao năng động.",           sizes: ["S","M","L","XL","XXL"],   rating: 4, reviews: 71  },
  { id: 108, name: "VELOX StretchPro Legging",categoryId: "quan-the-thao", categoryVi: "Quần Thể Thao",     price: 520000,  tag: "MỚI",      img: SIMG.shorts,   desc: "Quần legging co giãn cao cấp, cạp lưng rộng, hỗ trợ cơ bắp khi vận động.",                sizes: ["XS","S","M","L","XL"],    rating: 5, reviews: 109 },
  { id: 109, name: "VELOX HydroMax 500ml",    categoryId: "binh-nuoc",     categoryVi: "Bình Nước",         price: 190000,  tag: null,        img: SIMG.bottle,   desc: "Bình nước 500ml nhỏ gọn, nắp chịu lực, dễ mang theo mọi chuyến đi.",                      sizes: ["1 Size"],                 rating: 4, reviews: 37  },
  { id: 110, name: "VELOX SprintPack 15L",    categoryId: "ba-lo",         categoryVi: "Ba Lô Thể Thao",   price: 650000,  tag: "HOT",      img: SIMG.backpack, desc: "Ba lô chạy bộ 15L siêu nhẹ, ôm lưng tốt, tích hợp túi nước 2L.",                           sizes: ["1 Size"],                 rating: 5, reviews: 58  },
  { id: 111, name: "VELOX WristBand Pro",     categoryId: "phu-kien",      categoryVi: "Khăn & Phụ Kiện",  price: 120000,  tag: null,        img: SIMG.towel,    desc: "Băng cổ tay co giãn, thấm mồ hôi, không cản chuyển động khi tập luyện.",                   sizes: ["S/M","L/XL"],             rating: 4, reviews: 44  },
  { id: 112, name: "VELOX GripLite Gloves",   categoryId: "gang-tay",      categoryVi: "Găng Tay Thể Thao", price: 280000,  tag: "MỚI",      img: SIMG.gloves,   desc: "Găng tay nhẹ cho yoga và pilates, bảo vệ lòng bàn tay khỏi trầy xước khi tập.",            sizes: ["S","M","L"],              rating: 4, reviews: 29  },
];

/* ─────────────────────────────────────────────
   FAKE QR CODE (generated once at module level)
───────────────────────────────────────────── */
const QR_GRID: boolean[][] = (() => {
  const S = 21;
  const g: boolean[][] = Array.from({ length: S }, () => Array(S).fill(false));
  const finder = (r0: number, c0: number) => {
    for (let dr = 0; dr < 7; dr++) for (let dc = 0; dc < 7; dc++)
      g[r0+dr][c0+dc] = dr===0||dr===6||dc===0||dc===6||(dr>=2&&dr<=4&&dc>=2&&dc<=4);
  };
  finder(0,0); finder(0,14); finder(14,0);
  for (let i = 8; i < 13; i++) { g[6][i] = i%2===0; g[i][6] = i%2===0; }
  let seed = 0x5EED1234;
  for (let r = 0; r < S; r++) for (let c = 0; c < S; c++) {
    const skip = (r<8&&(c<8||c>=14))||(r>=14&&c<8)||r===6||c===6;
    if (!g[r][c] && !skip) { seed = ((seed*1664525)+1013904223)>>>0; g[r][c] = (seed>>>0)%5 > 1; }
  }
  return g;
})();

function VeloxQR({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative inline-block p-3 bg-white border-2 border-black">
      <svg viewBox="0 0 23 23" width="152" height="152" shapeRendering="crispEdges">
        <rect x="0" y="0" width="23" height="23" fill="white"/>
        {QR_GRID.map((row, r) => row.map((cell, c) => cell
          ? <rect key={`${r}-${c}`} x={c+1} y={r+1} width={1} height={1} fill="#000"/>
          : null
        ))}
      </svg>
      {scanning && (
        <div className="absolute inset-3 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-0.5" style={{ background: `linear-gradient(90deg,transparent,${OG},transparent)`, animation: "qrscan 2s ease-in-out infinite" }}/>
        </div>
      )}
      <style>{`@keyframes qrscan{0%,100%{top:4px}50%{top:calc(100% - 8px)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL ICONS
───────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.85a8.16 8.16 0 004.77 1.52V6.91a4.85 4.85 0 01-1-.22z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   SHARED BUTTONS
───────────────────────────────────────────── */
function BtnSolid({ children, onClick, full = false, disabled = false, style = {} }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean; disabled?: boolean; style?: React.CSSProperties;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`text-[11px] font-bold tracking-[0.2em] uppercase py-4 px-8 transition-all duration-200${full ? " w-full" : ""}`}
      style={{ fontFamily: FONT, background: disabled ? "#ccc" : h ? OG : "#000", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", letterSpacing: "0.2em", ...style }}>
      {children}
    </button>
  );
}
function BtnOutline({ children, onClick, dark = false, full = false }: {
  children: React.ReactNode; onClick?: () => void; dark?: boolean; full?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`text-[11px] font-bold uppercase py-4 px-8 transition-all duration-200${full ? " w-full" : ""}`}
      style={{ fontFamily: FONT, letterSpacing: "0.2em", ...(dark
        ? { border: "2px solid #fff", color: h ? OG : "#fff", background: h ? "#fff" : "transparent" }
        : { border: `2px solid ${h ? OG : "#000"}`, color: h ? "#fff" : "#000", background: h ? OG : "transparent" }
      )}}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product, onAdd, onView, isWishlisted, onToggleWishlist }: {
  product: Product; onAdd: (p: Product) => void; onView: (p: Product) => void;
  isWishlisted: boolean; onToggleWishlist: (id: number) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div className="cursor-pointer" style={{ fontFamily: FONT }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="relative overflow-hidden mb-3" style={{ background: "#F6F6F6", aspectRatio: "1/1" }} onClick={() => onView(product)}>
        <img src={product.img} alt={product.name} className="w-full h-full object-cover"
          style={{ transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
        {product.tag && (
          <span className="absolute top-3 left-3 text-white text-[9px] font-bold uppercase px-2.5 py-1" style={{ background: OG, letterSpacing: "0.15em" }}>{product.tag}</span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
          style={{ background: isWishlisted ? OG : "rgba(255,255,255,0.92)", opacity: hov || isWishlisted ? 1 : 0, transform: hov || isWishlisted ? "scale(1)" : "scale(0.7)" }}
          onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}>
          <Heart size={13} fill={isWishlisted ? "#fff" : "none"} stroke={isWishlisted ? "#fff" : "#000"} strokeWidth={2} />
        </button>
        <div className="absolute inset-x-0 bottom-0 py-3.5 flex items-center justify-center"
          style={{ background: "#000", transform: hov ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          onClick={e => { e.stopPropagation(); onAdd(product); }}>
          <span className="text-white text-[9px] font-bold uppercase" style={{ letterSpacing: "0.25em" }}>THÊM VÀO GIỎ</span>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 0 2px ${OG}`, opacity: hov ? 1 : 0, transition: "opacity 0.2s ease" }} />
      </div>
      <p className="text-sm font-bold uppercase leading-tight mb-1" style={{ letterSpacing: "0.05em" }}>{product.name}</p>
      <p className="text-xs text-gray-400 mb-1.5" style={{ letterSpacing: "0.06em" }}>{product.categoryVi}</p>
      <p className="text-sm font-black">{fmt(product.price)}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTH PAGE
───────────────────────────────────────────── */
function AuthPage({ onSuccess, onBack }: { onSuccess: (u: User) => void; onBack: () => void }) {
  const [tab, setTab] = useState<AuthTab>("login");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
  const [qrKey, setQrKey] = useState(0);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [reg, setReg] = useState({ name: "", email: "", phone: "", pw: "", pw2: "", agree: false });
  const [regErrs, setRegErrs] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    if (tab !== "qr") return;
    setQrTimer(60);
    const t = setInterval(() => setQrTimer(v => { if (v <= 1) { clearInterval(t); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [tab, qrKey]);

  const doSocial = (provider: User["provider"], displayName: string) =>
    onSuccess({ name: displayName, email: `${displayName.toLowerCase().replace(/\s/g,"")}@${provider}.com`, phone: "", provider, joinDate: new Date().toLocaleDateString("vi-VN") });

  const handleLogin = () => {
    setLoginErr("");
    if (!loginEmail || !loginPw) { setLoginErr("Vui lòng điền đầy đủ thông tin"); return; }
    if (!loginEmail.includes("@")) { setLoginErr("Email không hợp lệ"); return; }
    setLoginLoading(true);
    setTimeout(() => {
      const n = loginEmail.split("@")[0];
      onSuccess({ name: n.charAt(0).toUpperCase()+n.slice(1), email: loginEmail, phone: "", provider: "email", joinDate: new Date().toLocaleDateString("vi-VN") });
    }, 800);
  };

  const setR = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setReg(v => ({ ...v, [k]: e.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleRegister = () => {
    const e: Record<string, string> = {};
    if (!reg.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!reg.email.includes("@")) e.email = "Email không hợp lệ";
    if (!reg.phone.match(/^[0-9]{9,11}$/)) e.phone = "Số điện thoại không hợp lệ";
    if (reg.pw.length < 6) e.pw = "Tối thiểu 6 ký tự";
    if (reg.pw !== reg.pw2) e.pw2 = "Mật khẩu không khớp";
    if (!reg.agree) e.agree = "Vui lòng chấp nhận điều khoản";
    setRegErrs(e);
    if (Object.keys(e).length) return;
    setRegLoading(true);
    setTimeout(() => onSuccess({ name: reg.name, email: reg.email, phone: reg.phone, provider: "email", joinDate: new Date().toLocaleDateString("vi-VN") }), 900);
  };

  const inputCls = "w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black transition-all duration-150 bg-white";
  const labelCls = "block text-[10px] font-bold uppercase mb-1.5 text-gray-500";

  const SocialButton = ({ provider, icon, label, color }: { provider: User["provider"]; icon: React.ReactNode; label: string; color: string }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={() => doSocial(provider, `Người Dùng ${label}`)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        className="flex items-center justify-center gap-2.5 py-3 px-4 border transition-all duration-150 flex-1"
        style={{ borderColor: h ? color : "rgba(0,0,0,0.12)", background: h ? `${color}10` : "#fff", fontFamily: FONT }}>
        {icon}
        <span className="text-xs font-bold" style={{ letterSpacing: "0.05em" }}>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: FONT }}>
      {/* Left — brand visual */}
      <div className="hidden lg:flex w-[45%] relative bg-black flex-col justify-between overflow-hidden flex-shrink-0">
        <img src={IMG.authBg} alt="VELOX" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/15" />
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: OG }} />
        <div className="relative z-10 p-12">
          <button onClick={onBack}>
            <ImageWithFallback src={veloxLogo} alt="VELOX" className="h-8 w-auto object-contain" />
          </button>
        </div>
        <div className="relative z-10 p-12 pb-16">
          <p className="text-[10px] font-bold uppercase mb-4" style={{ color: OG, letterSpacing: "0.4em" }}>RA MẮT 01.01.2026</p>
          <h2 className="text-white font-black uppercase leading-[0.9] mb-6" style={{ fontSize: "clamp(32px,3.5vw,52px)", letterSpacing: "-0.01em" }}>
            DI CHUYỂN<br />VỚI<br />MỤC ĐÍCH
          </h2>
          <p className="text-white/45 text-sm leading-relaxed max-w-xs" style={{ wordSpacing: "0.05em" }}>
            Tham gia cộng đồng hơn 50.000 vận động viên đang tin dùng VELOX trên toàn quốc.
          </p>
          <div className="flex gap-8 mt-10">
            {[["50K+","Thành viên"],["40","Tỉnh thành"],["01.2026","Ra mắt"]].map(([n,l]) => (
              <div key={l}><p className="text-xl font-black" style={{ color: OG }}>{n}</p><p className="text-xs text-white/40 mt-0.5" style={{ letterSpacing: "0.08em" }}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 bg-white overflow-y-auto">
        <div className="max-w-[400px] w-full mx-auto">
          <div className="lg:hidden mb-8">
            <button onClick={onBack}><ImageWithFallback src={veloxLogo} alt="VELOX" className="h-7 w-auto object-contain" /></button>
          </div>

          <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: OG, letterSpacing: "0.3em" }}>
            {tab === "register" ? "TẠO TÀI KHOẢN" : tab === "qr" ? "ĐĂNG NHẬP NHANH" : "CHÀO MỪNG TRỞ LẠI"}
          </p>
          <h1 className="text-3xl font-black uppercase leading-tight mb-7" style={{ letterSpacing: "-0.01em" }}>
            {tab === "register" ? "Đăng Ký" : tab === "qr" ? "Mã QR" : "Đăng Nhập"}
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-black/10 mb-7">
            {(["login","register","qr"] as AuthTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-3 text-[10px] font-bold uppercase transition-all duration-150"
                style={{ letterSpacing: "0.14em", color: tab === t ? OG : "#999", borderBottom: tab === t ? `2px solid ${OG}` : "2px solid transparent" }}>
                {t === "login" ? "Đăng Nhập" : t === "register" ? "Đăng Ký" : "QR Code"}
              </button>
            ))}
          </div>

          {/* ── Login ── */}
          {tab === "login" && (
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={{ letterSpacing: "0.15em", fontFamily: FONT }}>Email *</label>
                <input className={inputCls} style={{ fontFamily: FONT }} type="email" placeholder="email@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <div>
                <label className={labelCls} style={{ letterSpacing: "0.15em", fontFamily: FONT }}>Mật khẩu *</label>
                <div className="relative">
                  <input className={inputCls} style={{ fontFamily: FONT, paddingRight: 44 }} type={showPw ? "text" : "password"} placeholder="••••••••" value={loginPw} onChange={e => setLoginPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                  <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                </div>
              </div>
              {loginErr && <p className="text-red-500 text-xs font-medium">{loginErr}</p>}
              <div className="flex justify-between items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#E5521C]" />
                  <span className="text-xs text-gray-500" style={{ letterSpacing: "0.03em" }}>Ghi nhớ đăng nhập</span>
                </label>
                <button className="text-xs font-bold hover:text-[#E5521C] transition-colors" style={{ letterSpacing: "0.04em" }}>Quên mật khẩu?</button>
              </div>
              <BtnSolid full onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
              </BtnSolid>
            </div>
          )}

          {/* ── Register ── */}
          {tab === "register" && (
            <div className="space-y-4">
              {[
                { k: "name", label: "Họ và tên *", type: "text", ph: "Nguyễn Văn A" },
                { k: "email", label: "Email *", type: "email", ph: "email@example.com" },
                { k: "phone", label: "Số điện thoại *", type: "tel", ph: "0912 345 678" },
              ].map(f => (
                <div key={f.k}>
                  <label className={labelCls} style={{ letterSpacing: "0.15em", fontFamily: FONT }}>{f.label}</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} type={f.type} placeholder={f.ph} value={(reg as any)[f.k]} onChange={setR(f.k)} />
                  {regErrs[f.k] && <p className="text-red-500 text-[10px] mt-1">{regErrs[f.k]}</p>}
                </div>
              ))}
              <div>
                <label className={labelCls} style={{ letterSpacing: "0.15em", fontFamily: FONT }}>Mật khẩu *</label>
                <div className="relative">
                  <input className={inputCls} style={{ fontFamily: FONT, paddingRight: 44 }} type={showPw ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" value={reg.pw} onChange={setR("pw")} />
                  <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                </div>
                {regErrs.pw && <p className="text-red-500 text-[10px] mt-1">{regErrs.pw}</p>}
              </div>
              <div>
                <label className={labelCls} style={{ letterSpacing: "0.15em", fontFamily: FONT }}>Xác nhận mật khẩu *</label>
                <div className="relative">
                  <input className={inputCls} style={{ fontFamily: FONT, paddingRight: 44 }} type={showPw2 ? "text" : "password"} placeholder="Nhập lại mật khẩu" value={reg.pw2} onChange={setR("pw2")} />
                  <button onClick={() => setShowPw2(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">{showPw2 ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                </div>
                {regErrs.pw2 && <p className="text-red-500 text-[10px] mt-1">{regErrs.pw2}</p>}
              </div>
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 accent-[#E5521C]" checked={reg.agree} onChange={setR("agree")} />
                <span className="text-xs text-gray-500 leading-relaxed" style={{ letterSpacing: "0.03em" }}>
                  Tôi đồng ý với <button className="underline font-bold hover:text-[#E5521C] transition-colors">Điều khoản dịch vụ</button> và <button className="underline font-bold hover:text-[#E5521C] transition-colors">Chính sách bảo mật</button> của VELOX
                </span>
              </label>
              {regErrs.agree && <p className="text-red-500 text-[10px]">{regErrs.agree}</p>}
              <BtnSolid full onClick={handleRegister} disabled={regLoading}>
                {regLoading ? "ĐANG TẠO TÀI KHOẢN..." : "TẠO TÀI KHOẢN"}
              </BtnSolid>
            </div>
          )}

          {/* ── QR ── */}
          {tab === "qr" && (
            <div className="flex flex-col items-center text-center">
              <p className="text-xs text-gray-500 mb-6 leading-relaxed" style={{ letterSpacing: "0.03em", wordSpacing: "0.05em" }}>
                Mở ứng dụng <strong>VELOX</strong> trên điện thoại → chọn <strong>Quét mã QR</strong> để đăng nhập tức thì.
              </p>
              <VeloxQR scanning={qrTimer > 0} />
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                  style={{ background: qrTimer > 20 ? "#16a34a" : qrTimer > 5 ? "#f59e0b" : "#ef4444", borderRadius: "50%" }}>
                  {qrTimer > 0 ? qrTimer : "!"}
                </div>
                <p className="text-xs text-gray-400" style={{ letterSpacing: "0.04em" }}>
                  {qrTimer > 0 ? `Mã hết hạn sau ${qrTimer}s` : "Mã đã hết hạn — vui lòng làm mới"}
                </p>
              </div>
              {qrTimer === 0 && (
                <button onClick={() => setQrKey(v => v + 1)}
                  className="mt-4 flex items-center gap-2 px-5 py-2.5 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-all duration-150"
                  style={{ letterSpacing: "0.15em", fontFamily: FONT }}>
                  <RefreshCw size={12}/> LÀM MỚI MÃ
                </button>
              )}
              <div className="mt-8 pt-6 border-t border-black/8 w-full">
                <p className="text-xs text-gray-400 mb-3" style={{ letterSpacing: "0.04em" }}>Chưa có tài khoản?</p>
                <button onClick={() => setTab("register")} className="text-xs font-black uppercase underline underline-offset-4 hover:text-[#E5521C] transition-colors" style={{ letterSpacing: "0.12em" }}>
                  ĐĂNG KÝ NGAY
                </button>
              </div>
            </div>
          )}

          {/* Social */}
          {tab !== "qr" && (
            <div className="mt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-black/8" />
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap" style={{ letterSpacing: "0.07em" }}>Hoặc tiếp tục với</span>
                <div className="flex-1 h-px bg-black/8" />
              </div>
              <div className="flex gap-2">
                <SocialButton provider="google" icon={<GoogleIcon />} label="Google" color="#4285F4" />
                <SocialButton provider="facebook" icon={<FbIcon />} label="Facebook" color="#1877F2" />
                <SocialButton provider="tiktok" icon={<TikTokIcon />} label="TikTok" color="#000" />
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-5" style={{ letterSpacing: "0.04em" }}>
                {tab === "login"
                  ? <>Chưa có tài khoản? <button onClick={() => setTab("register")} className="font-black underline hover:text-[#E5521C] transition-colors">Đăng ký ngay</button></>
                  : <>Đã có tài khoản? <button onClick={() => setTab("login")} className="font-black underline hover:text-[#E5521C] transition-colors">Đăng nhập</button></>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────── */
function ProfilePage({ user, wishlist, onToggleWishlist, onView, onAdd, onLogout }: {
  user: User; wishlist: number[]; onToggleWishlist: (id: number) => void;
  onView: (p: Product) => void; onAdd: (p: Product) => void; onLogout: () => void;
}) {
  const [tab, setTab] = useState<"info" | "orders" | "wishlist">("info");
  const wishlisted = ALL_PRODUCTS.filter(p => wishlist.includes(p.id));
  const statusColor = (s: string) => s === "Đã giao" ? "#16a34a" : s === "Đang giao" ? OG : "#888";
  const mockOrders = [
    { code: "VLX-A2F4B1", date: "15/06/2026", total: 4890000, status: "Đã giao", items: 2 },
    { code: "VLX-C7D8E2", date: "08/06/2026", total: 2490000, status: "Đang giao", items: 1 },
    { code: "VLX-G3H9I5", date: "01/06/2026", total: 6580000, status: "Đã giao", items: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="bg-black py-14 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center text-2xl font-black text-white flex-shrink-0" style={{ background: OG }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-2xl uppercase mb-0.5" style={{ letterSpacing: "0.05em" }}>{user.name}</p>
            <p className="text-white/50 text-sm" style={{ letterSpacing: "0.04em" }}>{user.email}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <p className="text-white/30 text-xs uppercase" style={{ letterSpacing: "0.1em" }}>Thành viên từ {user.joinDate}</p>
              <p className="text-white/30 text-xs uppercase" style={{ letterSpacing: "0.1em" }}>
                Qua {user.provider === "email" ? "Email" : user.provider === "facebook" ? "Facebook" : user.provider === "google" ? "Google" : "TikTok"}
              </p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase" style={{ letterSpacing: "0.15em" }}>
            <LogOut size={14} />Đăng xuất
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-black/8 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto flex gap-1">
          {([["info","THÔNG TIN"],["orders","ĐƠN HÀNG"],["wishlist",`YÊU THÍCH (${wishlist.length})`]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-4 text-[11px] font-bold uppercase transition-all duration-150"
              style={{ letterSpacing: "0.14em", color: tab === t ? OG : "#888", borderBottom: tab === t ? `2px solid ${OG}` : "2px solid transparent" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-12">
        {tab === "info" && (
          <div className="max-w-[580px]">
            <h2 className="text-xl font-black uppercase mb-8" style={{ letterSpacing: "0.06em" }}>THÔNG TIN CÁ NHÂN</h2>
            <div className="bg-white border border-black/8 p-8 space-y-5">
              {[["Họ và tên",user.name],["Email",user.email],["Số điện thoại",user.phone||"Chưa cập nhật"],["Ngày tham gia",user.joinDate]].map(([l,v]) => (
                <div key={l} className="flex items-start gap-6 pb-5 border-b border-black/5 last:border-0 last:pb-0">
                  <p className="text-[10px] font-bold uppercase text-gray-400 w-40 flex-shrink-0 pt-0.5" style={{ letterSpacing: "0.12em" }}>{l}</p>
                  <p className="text-sm font-semibold" style={{ letterSpacing: "0.03em" }}>{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6"><BtnSolid>CẬP NHẬT THÔNG TIN</BtnSolid></div>
          </div>
        )}
        {tab === "orders" && (
          <div>
            <h2 className="text-xl font-black uppercase mb-8" style={{ letterSpacing: "0.06em" }}>LỊCH SỬ ĐƠN HÀNG</h2>
            <div className="space-y-3">
              {mockOrders.map(o => (
                <div key={o.code} className="bg-white border border-black/8 p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-black uppercase" style={{ letterSpacing: "0.06em" }}>{o.code}</p>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1" style={{ background: statusColor(o.status)+"18", color: statusColor(o.status), letterSpacing: "0.12em" }}>{o.status}</span>
                    </div>
                    <p className="text-xs text-gray-400" style={{ letterSpacing: "0.05em" }}>{o.date} · {o.items} sản phẩm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black">{fmt(o.total)}</p>
                    <button className="text-[10px] font-bold uppercase underline underline-offset-4 hover:text-[#E5521C] transition-colors mt-1" style={{ letterSpacing: "0.1em" }}>Xem chi tiết</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === "wishlist" && (
          <div>
            <h2 className="text-xl font-black uppercase mb-8" style={{ letterSpacing: "0.06em" }}>SẢN PHẨM YÊU THÍCH</h2>
            {wishlisted.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Heart size={44} strokeWidth={1} className="mx-auto mb-4"/>
                <p className="text-sm font-bold uppercase" style={{ letterSpacing: "0.12em" }}>Chưa có sản phẩm yêu thích</p>
                <p className="text-xs mt-2" style={{ letterSpacing: "0.04em" }}>Nhấn ♡ trên sản phẩm để lưu vào đây</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {wishlisted.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onView={onView} isWishlisted={true} onToggleWishlist={onToggleWishlist} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────────── */
function CartDrawer({ open, onClose, cart, onQty, onRemove, onCheckout }: {
  open: boolean; onClose: () => void; cart: CartItem[];
  onQty: (id: number, s: string, d: number) => void;
  onRemove: (id: number, s: string) => void; onCheckout: () => void;
}) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s ease" }} />
      <div className="fixed top-0 right-0 h-full w-full z-50 flex flex-col bg-white shadow-2xl"
        style={{ fontFamily: FONT, maxWidth: 420, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
        <div className="flex items-center justify-between px-8 py-5 border-b border-black/10">
          <p className="text-sm font-black uppercase" style={{ letterSpacing: "0.18em" }}>GIỎ HÀNG ({count})</p>
          <button onClick={onClose} className="hover:text-[#E5521C] transition-colors p-1"><X size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5" style={{ scrollbarWidth: "none" }}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingBag size={44} strokeWidth={1} className="text-gray-200"/>
              <p className="text-sm font-black uppercase text-gray-400" style={{ letterSpacing: "0.15em" }}>Giỏ hàng trống</p>
            </div>
          ) : cart.map(item => (
            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 bg-[#F6F6F6]"><img src={item.img} alt={item.name} className="w-full h-full object-cover"/></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase leading-tight mb-0.5" style={{ letterSpacing: "0.04em" }}>{item.name}</p>
                <p className="text-[10px] text-gray-400 mb-1" style={{ letterSpacing: "0.08em" }}>{item.categoryVi} · Size {item.selectedSize}</p>
                <p className="text-sm font-black mb-2">{fmt(item.price)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => onQty(item.id, item.selectedSize, -1)} className="w-6 h-6 border border-black/20 flex items-center justify-center hover:border-black transition-colors"><Minus size={10}/></button>
                  <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                  <button onClick={() => onQty(item.id, item.selectedSize, 1)} className="w-6 h-6 border border-black/20 flex items-center justify-center hover:border-black transition-colors"><Plus size={10}/></button>
                  <button onClick={() => onRemove(item.id, item.selectedSize)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="px-8 py-6 border-t border-black/10 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-black uppercase text-gray-500" style={{ letterSpacing: "0.15em" }}>TỔNG CỘNG</p>
              <p className="text-xl font-black">{fmt(total)}</p>
            </div>
            <p className="text-[10px] text-gray-400" style={{ letterSpacing: "0.05em" }}>
              {total >= 2000000 ? "✓ Miễn phí vận chuyển" : `Còn ${fmt(2000000 - total)} để freeship`}
            </p>
            <BtnSolid full onClick={() => { onClose(); onCheckout(); }}>TIẾN HÀNH THANH TOÁN</BtnSolid>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SEARCH OVERLAY
───────────────────────────────────────────── */
function SearchOverlay({ open, onClose, onView }: { open: boolean; onClose: () => void; onView: (p: Product) => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = q.trim() ? ALL_PRODUCTS.filter(p => norm(p.name).includes(norm(q)) || norm(p.categoryVi).includes(norm(q)) || norm(p.desc).includes(norm(q))) : [];
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); else setQ(""); }, [open]);
  const pick = (p: Product) => { onClose(); setTimeout(() => onView(p), 280); };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: FONT, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transform: open ? "translateY(0)" : "translateY(-14px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
      <div className="border-b border-black/10 px-8 md:px-16 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center gap-4">
          <Search size={18} className="text-gray-300 flex-shrink-0"/>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm kiếm giày, danh mục..."
            className="flex-1 text-xl font-bold outline-none placeholder:text-gray-300" style={{ fontFamily: FONT, letterSpacing: "0.03em" }}/>
          {q && <button onClick={() => setQ("")} className="text-gray-400 hover:text-black p-1"><X size={16}/></button>}
          <button onClick={onClose} className="hover:text-[#E5521C] transition-colors p-1 ml-2"><X size={20}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 md:px-16 py-8 max-w-[1440px] mx-auto w-full" style={{ scrollbarWidth: "none" }}>
        {!q.trim() && (
          <>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-4" style={{ letterSpacing: "0.25em" }}>TÌM KIẾM PHỔ BIẾN</p>
            <div className="flex flex-wrap gap-2 mb-10">
              {["Giày chạy bộ","Giày đá bóng","Tập gym","Sprint X1","Surge Pro","Bóng rổ","Cầu lông"].map(t => (
                <button key={t} onClick={() => setQ(t)} className="px-4 py-2 border border-black/12 text-xs font-bold uppercase hover:border-black hover:bg-black hover:text-white transition-all duration-150" style={{ letterSpacing: "0.1em" }}>{t}</button>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-5" style={{ letterSpacing: "0.25em" }}>TẤT CẢ SẢN PHẨM</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ALL_PRODUCTS.map(p => (
                <button key={p.id} onClick={() => pick(p)} className="text-left group">
                  <div className="bg-[#F6F6F6] aspect-square overflow-hidden mb-2">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"/>
                  </div>
                  <p className="text-[10px] font-black uppercase leading-tight" style={{ letterSpacing: "0.05em" }}>{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fmt(p.price)}</p>
                </button>
              ))}
            </div>
          </>
        )}
        {q.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} strokeWidth={1} className="text-gray-200 mx-auto mb-4"/>
            <p className="text-sm font-bold text-gray-400" style={{ letterSpacing: "0.05em" }}>Không tìm thấy kết quả cho "{q}"</p>
          </div>
        )}
        {q.trim() && results.length > 0 && (
          <>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-6" style={{ letterSpacing: "0.25em" }}>{results.length} KẾT QUẢ</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {results.map(p => (
                <button key={p.id} onClick={() => pick(p)} className="text-left group">
                  <div className="bg-[#F6F6F6] aspect-square overflow-hidden mb-3 relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    {p.tag && <span className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 uppercase" style={{ background: OG, letterSpacing: "0.15em" }}>{p.tag}</span>}
                  </div>
                  <p className="text-xs font-black uppercase leading-tight mb-0.5" style={{ letterSpacing: "0.05em" }}>{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.categoryVi}</p>
                  <p className="text-sm font-black mt-1">{fmt(p.price)}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHECKOUT
───────────────────────────────────────────── */
function CheckoutPage({ cart, onSuccess, onBack }: { cart: CartItem[]; onSuccess: (o: { code: string; form: CheckoutForm }) => void; onBack: () => void }) {
  const [form, setForm] = useState<CheckoutForm>({ name:"",email:"",phone:"",address:"",city:"",district:"",payment:"cod" });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm,string>>>({});
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 2000000 ? 0 : 35000;
  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email không hợp lệ";
    if (!form.phone.match(/^[0-9]{9,11}$/)) e.phone = "SĐT không hợp lệ";
    if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ";
    if (!form.city) e.city = "Chọn tỉnh/thành";
    if (!form.district.trim()) e.district = "Nhập quận/huyện";
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = () => { if (!validate()) return; setLoading(true); setTimeout(() => onSuccess({ code: "VLX"+Math.random().toString(36).slice(2,8).toUpperCase(), form }), 1200); };
  const inputCls = "w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white";
  const labelCls = "block text-[10px] font-bold uppercase mb-1.5 text-gray-500";
  const cities = ["Hà Nội","TP. Hồ Chí Minh","Đà Nẵng","Hải Phòng","Cần Thơ","Bình Dương","Đồng Nai","Khánh Hòa","Nghệ An","Thanh Hóa","Quảng Ninh","Lâm Đồng"];
  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-10">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase hover:text-[#E5521C] transition-colors mb-8" style={{ letterSpacing: "0.18em" }}>
          <ArrowLeft size={13}/>GIỎ HÀNG
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          <div className="space-y-6">
            <div className="bg-white p-8 border border-black/8">
              <h2 className="text-base font-black uppercase mb-7" style={{ letterSpacing: "0.15em" }}>THÔNG TIN GIAO HÀNG</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Họ và tên *</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} value={form.name} onChange={set("name")} placeholder="Nguyễn Văn A"/>
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Email *</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} type="email" value={form.email} onChange={set("email")} placeholder="email@example.com"/>
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Số điện thoại *</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} type="tel" value={form.phone} onChange={set("phone")} placeholder="0912 345 678"/>
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Địa chỉ *</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} value={form.address} onChange={set("address")} placeholder="Số nhà, tên đường..."/>
                  {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Tỉnh / Thành phố *</label>
                  <select className={inputCls} style={{ fontFamily: FONT }} value={form.city} onChange={set("city")}>
                    <option value="">Chọn tỉnh/thành</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelCls} style={{ fontFamily: FONT, letterSpacing: "0.15em" }}>Quận / Huyện *</label>
                  <input className={inputCls} style={{ fontFamily: FONT }} value={form.district} onChange={set("district")} placeholder="Quận 1, Hoàn Kiếm..."/>
                  {errors.district && <p className="text-red-500 text-[10px] mt-1">{errors.district}</p>}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 border border-black/8">
              <h2 className="text-base font-black uppercase mb-6" style={{ letterSpacing: "0.15em" }}>PHƯƠNG THỨC THANH TOÁN</h2>
              <div className="space-y-3">
                {[
                  { val:"cod", label:"Thanh toán khi nhận hàng (COD)", sub:"Trả tiền mặt khi giao hàng" },
                  { val:"bank", label:"Chuyển khoản ngân hàng", sub:"VELOX Bank · STK: 1234 5678 9012" },
                  { val:"card", label:"Thẻ tín dụng / Thẻ ghi nợ", sub:"Visa, Mastercard, JCB" },
                ].map(o => (
                  <label key={o.val} className="flex items-start gap-4 p-4 border cursor-pointer transition-all duration-150"
                    style={{ borderColor: form.payment === o.val ? OG : "rgba(0,0,0,0.1)", background: form.payment === o.val ? "#FFF5F0" : "#fff" }}>
                    <input type="radio" name="pay" value={o.val} checked={form.payment === o.val} onChange={() => setForm(f => ({ ...f, payment: o.val as CheckoutForm["payment"] }))} className="mt-0.5 flex-shrink-0 accent-[#E5521C]"/>
                    <div>
                      <p className="text-sm font-black uppercase" style={{ color: form.payment === o.val ? OG : "#000", letterSpacing: "0.05em" }}>{o.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ letterSpacing: "0.03em" }}>{o.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white p-6 border border-black/8 sticky top-[80px]">
              <h2 className="text-sm font-black uppercase mb-5 pb-4 border-b border-black/8" style={{ letterSpacing: "0.18em" }}>ĐƠN HÀNG ({cart.reduce((s,i)=>s+i.qty,0)})</h2>
              <div className="space-y-4 mb-5 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-14 h-14 bg-[#F6F6F6] flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white text-[9px] font-black flex items-center justify-center" style={{ background: OG }}>{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase leading-tight" style={{ letterSpacing: "0.04em" }}>{item.name}</p>
                      <p className="text-[10px] text-gray-400">Size {item.selectedSize}</p>
                    </div>
                    <p className="text-xs font-black flex-shrink-0">{fmt(item.price*item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/8 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Tạm tính</span><span className="font-bold">{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Vận chuyển</span><span className="font-bold" style={{ color: shipping===0?"#16a34a":"#000" }}>{shipping===0?"MIỄN PHÍ":fmt(shipping)}</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-black/8">
                  <span className="text-sm font-black uppercase" style={{ letterSpacing: "0.1em" }}>TỔNG</span>
                  <span className="text-xl font-black">{fmt(subtotal+shipping)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F8F8] mb-5">
                <Truck size={13} className="text-gray-400 flex-shrink-0"/>
                <p className="text-[10px] text-gray-500" style={{ letterSpacing: "0.04em" }}>Giao hàng <strong>3–5 ngày làm việc</strong></p>
              </div>
              <BtnSolid full onClick={submit} disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG →"}
              </BtnSolid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORDER SUCCESS
───────────────────────────────────────────── */
function OrderSuccessPage({ orderCode, form, onHome }: { orderCode: string; form: CheckoutForm; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-white pt-[64px] flex items-center justify-center px-8 py-16" style={{ fontFamily: FONT }}>
      <div className="max-w-[500px] w-full text-center">
        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center" style={{ background: "#F0FFF4", border: "3px solid #16a34a" }}>
          <CheckCircle size={36} style={{ color: "#16a34a" }} strokeWidth={1.5}/>
        </div>
        <p className="text-[10px] font-bold uppercase mb-3" style={{ color: OG, letterSpacing: "0.35em" }}>ĐẶT HÀNG THÀNH CÔNG</p>
        <h1 className="text-4xl font-black uppercase leading-none mb-5" style={{ letterSpacing: "-0.01em" }}>CẢM ƠN BẠN!</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8" style={{ letterSpacing: "0.03em", wordSpacing: "0.05em" }}>
          Đơn hàng đã được xác nhận. Chúng tôi sẽ liên hệ qua <strong>{form.email}</strong> để cập nhật tình trạng giao hàng.
        </p>
        <div className="border border-black/10 p-6 text-left mb-8 space-y-4">
          {[["MÃ ĐƠN HÀNG",orderCode],["KHÁCH HÀNG",form.name],["ĐỊA CHỈ",`${form.address}, ${form.district}, ${form.city}`],["THANH TOÁN",form.payment==="cod"?"COD":form.payment==="bank"?"Chuyển khoản":"Thẻ tín dụng"]].map(([l,v]) => (
            <div key={l} className="flex gap-4">
              <p className="text-[10px] font-bold uppercase text-gray-400 w-36 flex-shrink-0" style={{ letterSpacing: "0.12em" }}>{l}</p>
              <p className="text-xs font-semibold" style={{ letterSpacing: "0.04em" }}>{v}</p>
            </div>
          ))}
        </div>
        <BtnSolid full onClick={onHome}>TIẾP TỤC MUA SẮM</BtnSolid>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHOES PAGE
───────────────────────────────────────────── */
function ShoesPage({ onSelectCat }: { onSelectCat: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-white pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="relative bg-black overflow-hidden" style={{ height: 360 }}>
        <img src={IMG.menBanner} alt="Giày VELOX" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 md:px-16 max-w-[1440px] mx-auto">
          <p className="text-[10px] font-bold uppercase mb-3" style={{ color: OG, letterSpacing: "0.4em" }}>DANH MỤC</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontSize: "clamp(44px,7vw,80px)", letterSpacing: "-0.01em" }}>GIÀY</h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed" style={{ wordSpacing: "0.05em" }}>
            Khám phá các dòng giày thể thao chuyên dụng — được thiết kế riêng cho từng môn thể thao và phong cách sống.
          </p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SHOE_CATS.map(cat => (
            <button key={cat.id} onClick={() => onSelectCat(cat.id)} className="group text-left relative overflow-hidden bg-black cursor-pointer" style={{ aspectRatio: "3/4" }}>
              <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.75, transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "0.45"; el.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLImageElement; el.style.opacity = "0.75"; el.style.transform = "scale(1)"; }}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
              <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
                <p className="text-[10px] font-bold text-white/50 mb-1" style={{ letterSpacing: "0.12em" }}>{cat.count} SẢN PHẨM</p>
                <h3 className="text-xl font-black uppercase text-white leading-tight mb-2" style={{ letterSpacing: "0.04em" }}>{cat.label}</h3>
                <p className="text-xs text-white/55 leading-relaxed" style={{ letterSpacing: "0.03em" }}>{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCTS PAGE
───────────────────────────────────────────── */
function ProductsPage({ initCat, onView, onAdd, wishlist, onToggleWishlist }: {
  initCat?: string; onView: (p: Product) => void; onAdd: (p: Product) => void; wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [active, setActive] = useState(initCat || "all");
  const [sort, setSort] = useState("default");
  useEffect(() => { if (initCat) setActive(initCat); }, [initCat]);
  const cats = [{ id: "all", label: "Tất cả" }, ...SPORTS_CATS.map(c => ({ id: c.id, label: c.label }))];
  let shown = active === "all" ? SPORTS_PRODUCTS : SPORTS_PRODUCTS.filter(p => p.categoryId === active);
  if (sort === "asc") shown = [...shown].sort((a,b) => a.price-b.price);
  if (sort === "desc") shown = [...shown].sort((a,b) => b.price-a.price);
  if (sort === "new") shown = [...shown].filter(p=>p.tag==="MỚI").concat(shown.filter(p=>p.tag!=="MỚI"));
  return (
    <div className="min-h-screen bg-white pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="bg-black py-12 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[10px] font-bold uppercase mb-2" style={{ color: OG, letterSpacing: "0.4em" }}>TRANG BỊ THỂ THAO</p>
          <h1 className="text-white font-black uppercase leading-none" style={{ fontSize: "clamp(32px,5vw,60px)", letterSpacing: "-0.01em" }}>
            {active === "all" ? "TẤT CẢ SẢN PHẨM" : (cats.find(c=>c.id===active)?.label?.toUpperCase() ?? "SẢN PHẨM")}
          </h1>
        </div>
      </div>
      <div className="border-b border-black/8 bg-white sticky top-[64px] z-30">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex items-center justify-between gap-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-1">
            {cats.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)} className="px-4 py-2 text-[10px] font-bold uppercase whitespace-nowrap transition-all duration-150"
                style={{ letterSpacing: "0.1em", background: active===c.id ? OG : "transparent", color: active===c.id ? "#fff" : "#888" }}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ChevronDown size={12} className="text-gray-400"/>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-[10px] font-bold uppercase border-none outline-none bg-transparent cursor-pointer" style={{ letterSpacing: "0.1em", fontFamily: FONT }}>
              <option value="default">SẮP XẾP</option>
              <option value="new">MỚI NHẤT</option>
              <option value="asc">GIÁ TĂNG DẦN</option>
              <option value="desc">GIÁ GIẢM DẦN</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-12">
        <p className="text-xs text-gray-400 mb-6 font-bold uppercase" style={{ letterSpacing: "0.15em" }}>{shown.length} SẢN PHẨM</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {shown.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} onView={onView} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist}/>)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────── */
function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="relative bg-black overflow-hidden" style={{ height: "70vh", minHeight: 480 }}>
        <img src={IMG.authBg} alt="VELOX" className="absolute inset-0 w-full h-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p className="text-[10px] font-bold uppercase mb-5" style={{ color: OG, letterSpacing: "0.5em" }}>RA MẮT 01.01.2026</p>
          <h1 className="text-white font-black uppercase leading-[0.88]" style={{ fontSize: "clamp(44px,7vw,90px)", letterSpacing: "-0.01em" }}>VỀ CHÚNG TÔI</h1>
          <p className="text-white/50 text-base mt-6 max-w-2xl leading-relaxed" style={{ letterSpacing: "0.03em", wordSpacing: "0.06em" }}>
            Thương hiệu giày thể thao Việt Nam sinh ra từ niềm đam mê và khát vọng chinh phục giới hạn.
          </p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <p className="text-[10px] font-bold uppercase mb-4" style={{ color: OG, letterSpacing: "0.4em" }}>CÂU CHUYỆN THƯƠNG HIỆU</p>
            <h2 className="font-black uppercase leading-tight mb-8" style={{ fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-0.01em" }}>BẮT ĐẦU<br />TỪ NGÀY<br />01.01.2026</h2>
          </div>
          <div className="space-y-5 pt-2">
            {[
              "VELOX ra mắt vào đúng ngày đầu tiên của năm 2026, với một cam kết rõ ràng: tạo ra những đôi giày thể thao chất lượng quốc tế mang bản sắc Việt Nam.",
              "Được sáng lập bởi nhóm kỹ sư thiết kế và vận động viên chuyên nghiệp, VELOX hiểu rằng mỗi đôi giày không chỉ là trang bị — đó là người bạn đồng hành trên mỗi hành trình.",
              "Chỉ trong 6 tháng đầu, VELOX đã có mặt tại hơn 40 tỉnh thành Việt Nam với hơn 50.000 khách hàng tin dùng, trở thành thương hiệu giày thể thao Việt Nam phát triển nhanh nhất năm 2026.",
            ].map((t,i) => <p key={i} className="text-sm text-gray-700 leading-[1.9]" style={{ letterSpacing: "0.03em", wordSpacing: "0.06em" }}>{t}</p>)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-24">
          {[
            { date:"01.01.2026", title:"Ngày ra mắt", desc:"VELOX chính thức ra mắt với 4 dòng sản phẩm đầu tiên tại TP.HCM và Hà Nội." },
            { date:"03.2026", title:"Mở rộng danh mục", desc:"Ra mắt thêm giày đá bóng, cầu lông và leo núi — đáp ứng nhu cầu đa dạng." },
            { date:"06.2026", title:"50.000 khách hàng", desc:"Cột mốc 50.000 đơn hàng, phủ sóng 40 tỉnh thành trên toàn quốc." },
            { date:"2027 →", title:"Tầm nhìn quốc tế", desc:"Mở rộng thị trường Đông Nam Á và xây dựng nhà máy sản xuất xanh." },
          ].map((t,i) => (
            <div key={i} className="border-t-2 pt-6 pr-8" style={{ borderColor: i===0?OG:"rgba(0,0,0,0.1)" }}>
              <p className="text-[10px] font-bold uppercase mb-2" style={{ color: OG, letterSpacing: "0.1em" }}>{t.date}</p>
              <h4 className="text-lg font-black uppercase mb-3" style={{ letterSpacing: "0.04em" }}>{t.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ letterSpacing: "0.03em", wordSpacing: "0.05em" }}>{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n:"01", t:"HIỆU SUẤT", b:"Mỗi sản phẩm nghiên cứu từ dữ liệu sinh cơ học của hàng nghìn vận động viên Việt Nam." },
            { n:"02", t:"BỀN VỮNG", b:"Cam kết 40% nguyên liệu tái chế vào 2027. Mỗi hộp đựng giày VELOX đều có thể tái chế hoàn toàn." },
            { n:"03", t:"CỘNG ĐỒNG", b:"VELOX đồng hành cùng hơn 200 câu lạc bộ thể thao nghiệp dư trên khắp Việt Nam." },
          ].map(v => (
            <div key={v.n} className="border-t-2 border-black pt-8">
              <p className="text-5xl font-black mb-5" style={{ color: OG }}>{v.n}</p>
              <h3 className="text-xl font-black uppercase mb-4" style={{ letterSpacing: "0.05em" }}>{v.t}</h3>
              <p className="text-sm text-gray-500 leading-[1.8]" style={{ letterSpacing: "0.03em", wordSpacing: "0.06em" }}>{v.b}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black py-20 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[["50K+","Khách hàng tin dùng"],["40","Tỉnh thành phân phối"],["01.01.2026","Ngày ra mắt"],["100%","Cam kết hiệu suất"]].map(([n,l]) => (
            <div key={l}><p className="text-4xl font-black mb-2" style={{ color: OG, letterSpacing:"-0.01em" }}>{n}</p><p className="text-xs text-white/50 uppercase font-bold" style={{ letterSpacing:"0.12em" }}>{l}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT DETAIL
───────────────────────────────────────────── */
function ProductDetail({ product, onBack, onAdd, isWishlisted, onToggleWishlist }: {
  product: Product; onBack: () => void; onAdd: (p: Product, size: string) => void;
  isWishlisted: boolean; onToggleWishlist: (id: number) => void;
}) {
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const related = ALL_PRODUCTS.filter(p => p.categoryId===product.categoryId && p.id!==product.id).slice(0,4);
  const handleAdd = () => { if(!size) return; onAdd(product,size); setAdded(true); setTimeout(()=>setAdded(false),1800); };
  return (
    <div className="min-h-screen bg-white pt-[64px]" style={{ fontFamily: FONT }}>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 pt-8">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase hover:text-[#E5521C] transition-colors mb-8" style={{ letterSpacing: "0.18em" }}>
          <ArrowLeft size={13}/>QUAY LẠI
        </button>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div className="relative bg-[#F6F6F6] overflow-hidden" style={{ aspectRatio:"1/1" }}>
          <img src={product.img} alt={product.name} className="w-full h-full object-cover"/>
          {product.tag && <span className="absolute top-5 left-5 text-white text-[9px] font-bold uppercase px-3 py-1.5" style={{ background:OG, letterSpacing:"0.16em" }}>{product.tag}</span>}
        </div>
        <div className="flex flex-col pt-2">
          <p className="text-[10px] font-bold uppercase mb-2" style={{ color:OG, letterSpacing:"0.35em" }}>{product.categoryVi}</p>
          <h1 className="font-black uppercase leading-tight mb-4" style={{ fontSize:"clamp(28px,3.5vw,48px)", letterSpacing:"-0.01em" }}>{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-2xl font-black">{fmt(product.price)}</p>
            <div className="flex items-center gap-0.5 ml-1">
              {[...Array(5)].map((_,i) => <Star key={i} size={11} fill={i<product.rating?OG:"none"} stroke={OG}/>)}
              <span className="text-xs text-gray-400 ml-1.5" style={{ letterSpacing:"0.04em" }}>({product.reviews})</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-[1.85] mb-8" style={{ letterSpacing:"0.03em", wordSpacing:"0.06em" }}>{product.desc}</p>
          <div className="flex gap-6 mb-8 pb-8 border-b border-black/10">
            {[{icon:Zap,t:"Siêu nhẹ"},{icon:Shield,t:"Bền bỉ"},{icon:CheckCircle,t:"BH 24 tháng"}].map(({icon:Icon,t}) => (
              <div key={t} className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500" style={{ letterSpacing:"0.1em" }}>
                <Icon size={13} style={{ color:OG }}/>{t}
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-bold uppercase" style={{ letterSpacing:"0.22em" }}>CHỌN SIZE</p>
              <button className="text-[10px] font-bold uppercase underline text-gray-400 hover:text-black transition-colors">BẢNG SIZE</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} className="w-12 h-12 text-xs font-black border-2 transition-all duration-150"
                  style={{ borderColor:size===s?OG:"rgba(0,0,0,0.12)", background:size===s?OG:"transparent", color:size===s?"#fff":"#000" }}>
                  {s}
                </button>
              ))}
            </div>
            {!size && <p className="text-[10px] text-gray-400 mt-2" style={{ letterSpacing:"0.08em" }}>Vui lòng chọn size</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 py-4 text-[11px] font-bold uppercase flex items-center justify-center gap-2 transition-all duration-200"
              style={{ fontFamily:FONT, background:added?"#16a34a":size?OG:"#ccc", color:"#fff", cursor:size?"pointer":"not-allowed", letterSpacing:"0.2em" }}>
              {added ? <><CheckCircle size={14}/>ĐÃ THÊM VÀO GIỎ</> : "THÊM VÀO GIỎ"}
            </button>
            <button onClick={() => onToggleWishlist(product.id)} className="w-14 h-14 border-2 flex items-center justify-center transition-all duration-150"
              style={{ borderColor:isWishlisted?OG:"rgba(0,0,0,0.15)", background:isWishlisted?"#FFF5F0":"#fff" }}>
              <Heart size={16} fill={isWishlisted?OG:"none"} stroke={isWishlisted?OG:"#000"}/>
            </button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="border-t border-black/8 py-16 px-8 md:px-16 max-w-[1440px] mx-auto">
          <p className="text-[10px] font-bold uppercase mb-2" style={{ color:OG, letterSpacing:"0.35em" }}>CÙNG DANH MỤC</p>
          <h2 className="text-2xl font-black uppercase mb-8" style={{ letterSpacing:"0.04em" }}>SẢN PHẨM LIÊN QUAN</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} onAdd={rp => onAdd(rp,rp.sizes[0])} onView={onBack} isWishlisted={false} onToggleWishlist={onToggleWishlist}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ onView, onAdd, onNav, wishlist, onToggleWishlist }: {
  onView: (p: Product) => void; onAdd: (p: Product) => void; onNav: (p: Page, catId?: string) => void;
  wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => carouselRef.current?.scrollBy({ left: dir === "right" ? 260 : -260, behavior: "smooth" });

  // Hero auto-slider
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: FONT }}>
      <section className="relative w-full bg-black overflow-hidden" style={{ height:"100vh", minHeight:640 }}>

        {/* ── Sliding images (right → left) ── */}
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: 0.62,
                transform: `translateX(${(i - heroIdx) * 100}%)`,
                transition: "transform 1.1s cubic-bezier(0.77, 0, 0.175, 1)",
                willChange: "transform",
              }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" style={{ zIndex: 1 }}/>
        {/* Orange accent stripe */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: OG, zIndex: 2 }}/>

        {/* Text content */}
        <div className="relative h-full flex flex-col justify-end pb-20 md:pb-28 px-8 md:px-16 max-w-[1440px] mx-auto" style={{ zIndex: 2 }}>
          <h1 className="text-white font-black uppercase mb-8" style={{ fontSize:"clamp(36px,5.5vw,72px)", letterSpacing:"0.04em", lineHeight:"1.18" }}>
            BỨT PHÁ<br />MỌI GIỚI HẠN
          </h1>
          <p className="text-white/60 text-base mb-10 max-w-[420px] leading-[1.8]" style={{ letterSpacing:"0.03em", wordSpacing:"0.07em" }}>
            Được thiết kế cho những vận động viên không bao giờ bỏ cuộc. Được xây dựng cho mọi giới hạn bạn sắp vượt qua.
          </p>
          <div className="flex flex-wrap gap-3">
            <BtnSolid onClick={() => shopRef.current?.scrollIntoView({ behavior:"smooth" })}>MUA NGAY</BtnSolid>
            <BtnOutline dark onClick={() => onNav("shoes")}>KHÁM PHÁ GIÀY</BtnOutline>
          </div>
        </div>

        {/* Slide dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ zIndex: 2 }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="transition-all duration-400"
              style={{
                height: 3,
                width: i === heroIdx ? 28 : 10,
                background: i === heroIdx ? OG : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10" style={{ zIndex: 2 }}>
          <div
            className="h-full"
            style={{
              background: OG,
              width: `${((heroIdx + 1) / HERO_SLIDES.length) * 100}%`,
              transition: "width 5s linear",
            }}
          />
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-8 right-8 md:right-16 flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase" style={{ zIndex: 2, letterSpacing:"0.25em" }}>
          <span style={{ color: OG, fontVariantNumeric: "tabular-nums" }}>
            {String(heroIdx + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
        </div>
      </section>

      <section className="py-24 md:py-32 px-8 md:px-16 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color:OG, letterSpacing:"0.35em" }}>Danh mục</p>
            <h2 className="font-black uppercase leading-none" style={{ fontSize:"clamp(28px,4vw,48px)", letterSpacing:"-0.01em" }}>LOẠI GIÀY</h2>
          </div>
          <button onClick={() => onNav("shoes")} className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase hover:text-[#E5521C] transition-colors" style={{ letterSpacing:"0.2em" }}>
            XEM TẤT CẢ <ChevronRight size={12}/>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          {[
            { label:"GIÀY",          sub:"XEM", img:IMG.catMen,   action:() => onNav("shoes") },
            { label:"ÁO & QUẦN",     sub:"XEM", img:IMG.catWomen, action:() => onNav("products","ao-the-thao") },
            { label:"SẢN PHẨM KHÁC", sub:"XEM", img:IMG.catGear,  action:() => onNav("products") },
          ].map(cat => (
            <div key={cat.label} className="group relative overflow-hidden bg-black cursor-pointer" style={{ aspectRatio:"3/4" }} onClick={cat.action}>
              <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity:0.8, transition:"opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLImageElement; el.style.opacity="0.5"; el.style.transform="scale(1.07)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLImageElement; el.style.opacity="0.8"; el.style.transform="scale(1)"; }}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"/>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-white pointer-events-none">
                <h3 className="font-black uppercase text-center mb-4 leading-tight px-4" style={{ fontSize:"clamp(22px,3vw,38px)", letterSpacing:"0.04em" }}>{cat.label}</h3>
                <span className="text-[10px] font-bold uppercase underline underline-offset-4 text-white/75" style={{ letterSpacing:"0.25em" }}>{cat.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={shopRef} id="shop" className="py-24 md:py-32 border-t border-black/5">
        <div className="px-8 md:px-16 max-w-[1440px] mx-auto mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color:OG, letterSpacing:"0.35em" }}>Hàng mới về</p>
            <h2 className="font-black uppercase leading-none" style={{ fontSize:"clamp(28px,4vw,48px)", letterSpacing:"-0.01em" }}>NỔI BẬT</h2>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => scroll("left")} className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-150"><ChevronLeft size={14}/></button>
            <button onClick={() => scroll("right")} className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-150"><ChevronRight size={14}/></button>
          </div>
        </div>
        <div ref={carouselRef} className="flex gap-4 overflow-x-auto pl-8 md:pl-16 pr-8 md:pr-16 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth:"none" }}>
          {ALL_PRODUCTS.map(p => (
            <div key={p.id} className="flex-shrink-0 snap-start" style={{ width:"calc(25% - 12px)", minWidth:230 }}>
              <ProductCard product={p} onAdd={onAdd} onView={onView} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist}/>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND SPIRIT BANNER — thay URL src bên dưới để đổi ảnh nền */}
      <section className="w-full relative overflow-hidden flex items-center justify-center" style={{ minHeight: 560 }}>
        <img
          src={SIMG.brandBg}
          alt="VELOX Brand Spirit"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `${OG}E0` }} />
        <div className="relative z-10 py-20 md:py-32 px-8 text-center w-full flex flex-col items-center">
          <p className="text-white/70 text-[10px] font-bold uppercase mb-8" style={{ letterSpacing:"0.5em" }}>TRIẾT LÝ CỦA CHÚNG TÔI</p>
          <h2 className="text-white font-black uppercase leading-[0.9] mb-12" style={{ fontSize:"clamp(44px,9vw,100px)", letterSpacing:"-0.02em" }}>
            DI CHUYỂN<br />VỚI<br />MỤC ĐÍCH
          </h2>
          <BtnOutline dark onClick={() => onNav("about")}>KHÁM PHÁ CÂU CHUYỆN CỦA CHÚNG TÔI</BtnOutline>
        </div>
      </section>

      <section className="py-24 md:py-32 px-8 md:px-16 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase mb-2" style={{ color:OG, letterSpacing:"0.35em" }}>Cộng đồng</p>
            <h2 className="font-black uppercase leading-none" style={{ fontSize:"clamp(28px,4vw,48px)", letterSpacing:"-0.01em" }}>SỐNG ĐÚNG CHẤT</h2>
          </div>
          <a href="#" className="text-[10px] font-bold uppercase underline underline-offset-4 hover:text-[#E5521C] transition-colors" style={{ letterSpacing:"0.2em" }}>#VELOX</a>
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"300px 300px" }}>
          <div className="overflow-hidden bg-gray-100 group cursor-pointer" style={{ gridRow:"1 / 3" }}>
            <img src={IMG.i1} alt="Vận động viên VELOX" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"/>
          </div>
          {[IMG.i2,IMG.i3,IMG.i4,IMG.i5].map((url,i) => (
            <div key={i} className="overflow-hidden bg-gray-100 group cursor-pointer">
              <img src={url} alt="Phong cách sống VELOX" className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"/>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [prevPage, setPrevPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initCat, setInitCat] = useState<string | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{ code: string; form: CheckoutForm } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
  useEffect(() => { setMobileMenu(false); setUserDropdown(false); }, [page]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setUserDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const navigate = useCallback((p: Page, catId?: string) => { setPrevPage(page); setInitCat(catId); setPage(p); setSelectedProduct(null); }, [page]);
  const viewProduct = useCallback((p: Product) => { setPrevPage(page); setSelectedProduct(p); setPage("product"); }, [page]);
  const addToCart = useCallback((p: Product, size = p.sizes[0]) => {
    setCart(prev => { const ex = prev.find(i => i.id===p.id && i.selectedSize===size); if (ex) return prev.map(i => i.id===p.id && i.selectedSize===size ? {...i,qty:i.qty+1} : i); return [...prev,{...p,qty:1,selectedSize:size}]; });
    setFlashGreen(true); setTimeout(() => setFlashGreen(false), 1200); setCartOpen(true);
  }, []);
  const toggleWishlist = useCallback((id: number) => { setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]); }, []);
  const qtyChange = (id: number, s: string, d: number) => setCart(prev => prev.map(i => i.id===id && i.selectedSize===s ? {...i,qty:i.qty+d} : i).filter(i=>i.qty>0));
  const removeItem = (id: number, s: string) => setCart(prev => prev.filter(i => !(i.id===id && i.selectedSize===s)));
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const NAV = [
    { label:"MỚI", page:"home" as Page, anchor:"shop" },
    { label:"GIÀY", page:"shoes" as Page },
    { label:"SẢN PHẨM", page:"products" as Page },
    { label:"VỀ CHÚNG TÔI", page:"about" as Page },
  ];
  const handleNav = (item: typeof NAV[number]) => {
    if (item.anchor && page==="home") document.getElementById(item.anchor)?.scrollIntoView({ behavior:"smooth" });
    else navigate(item.page);
  };

  if (page === "auth") {
    return <AuthPage onSuccess={u => { setUser(u); navigate("home"); }} onBack={() => navigate(prevPage || "home")} />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: FONT, letterSpacing:"0.01em", wordSpacing:"0.03em" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-[64px] flex items-center justify-between">
          <button onClick={() => navigate("home")} className="flex-shrink-0 w-[130px] focus:outline-none">
            <ImageWithFallback src={veloxLogo} alt="VELOX" className="h-7 w-auto object-contain"/>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map(item => {
              const active = page===item.page && item.page!=="home";
              return (
                <button key={item.label} onClick={() => handleNav(item)}
                  className="text-[11px] font-bold uppercase pb-0.5 transition-all duration-150"
                  style={{ fontFamily:FONT, letterSpacing:"0.18em", color:active?OG:"#000", borderBottom:active?`2px solid ${OG}`:"2px solid transparent" }}
                  onMouseEnter={e => { if(!active)(e.currentTarget as HTMLButtonElement).style.color=OG; }}
                  onMouseLeave={e => { if(!active)(e.currentTarget as HTMLButtonElement).style.color="#000"; }}>
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 w-[130px] justify-end">
            <button onClick={() => setSearchOpen(true)} className="text-black hover:text-[#E5521C] transition-colors p-1"><Search size={17} strokeWidth={2}/></button>

            {/* User */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => !user ? navigate("auth") : setUserDropdown(v=>!v)} className="p-1 transition-colors" style={{ color: user ? OG : "#000" }}>
                {user ? (
                  <div className="w-7 h-7 flex items-center justify-center text-white text-xs font-black" style={{ background:OG, fontFamily:FONT }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : <User size={17} strokeWidth={2}/>}
              </button>
              {userDropdown && user && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-black/10 shadow-xl z-50" style={{ animation:"dropIn 0.2s ease" }}>
                  <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  <div className="px-5 py-4 border-b border-black/8 flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ background:OG, fontFamily:FONT }}>{user.name.charAt(0).toUpperCase()}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-black uppercase truncate" style={{ letterSpacing:"0.04em" }}>{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { icon:User, label:"Tài khoản của tôi", action:()=>navigate("profile") },
                      { icon:Package, label:"Đơn hàng của tôi", action:()=>navigate("profile") },
                      { icon:Heart, label:`Yêu thích (${wishlist.length})`, action:()=>{ navigate("profile"); } },
                    ].map(item => (
                      <button key={item.label} onClick={() => { setUserDropdown(false); item.action(); }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors">
                        <item.icon size={14} className="text-gray-400 flex-shrink-0"/>
                        <span className="text-xs font-bold" style={{ letterSpacing:"0.06em", fontFamily:FONT }}>{item.label}</span>
                        {item.label.startsWith("Yêu thích") && wishlist.length>0 && (
                          <span className="ml-auto text-[9px] font-black text-white px-1.5 py-0.5" style={{ background:OG }}>{wishlist.length}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-black/8 py-1">
                    <button onClick={() => { setUserDropdown(false); setUser(null); navigate("home"); }}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-red-500">
                      <LogOut size={14} className="flex-shrink-0"/>
                      <span className="text-xs font-bold" style={{ letterSpacing:"0.06em", fontFamily:FONT }}>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-black hover:text-[#E5521C] transition-colors p-1">
              <ShoppingBag size={17} strokeWidth={2}/>
              {cartCount>0 && <span className="absolute -top-1 -right-1 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center" style={{ background:flashGreen?"#16a34a":OG, transition:"background 0.3s ease" }}>{cartCount}</span>}
            </button>

            {/* Wishlist shortcut */}
            <button onClick={() => user ? navigate("profile") : navigate("auth")} className="relative p-1 transition-colors hidden md:flex">
              <Heart size={17} strokeWidth={2} fill={wishlist.length>0?OG:"none"} stroke={wishlist.length>0?OG:"#000"}/>
              {wishlist.length>0 && <span className="absolute -top-1 -right-1 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center" style={{ background:OG }}>{wishlist.length}</span>}
            </button>

            <button onClick={() => setMobileMenu(v=>!v)} className="md:hidden text-black hover:text-[#E5521C] transition-colors p-1">
              {mobileMenu ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
        <div className="md:hidden bg-white border-t border-black/10 overflow-hidden" style={{ maxHeight:mobileMenu?"320px":"0px", transition:"max-height 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
          <div className="px-8 py-6 flex flex-col gap-5">
            {NAV.map(item => (
              <button key={item.label} onClick={() => handleNav(item)} className="text-left text-sm font-black uppercase transition-colors"
                style={{ fontFamily:FONT, letterSpacing:"0.18em", color:page===item.page?OG:"#000" }}>
                {item.label}
              </button>
            ))}
            {!user ? (
              <button onClick={() => navigate("auth")} className="text-left text-sm font-black uppercase" style={{ fontFamily:FONT, letterSpacing:"0.18em", color:OG }}>
                ĐĂNG NHẬP / ĐĂNG KÝ
              </button>
            ) : (
              <button onClick={() => navigate("profile")} className="text-left text-sm font-black uppercase" style={{ fontFamily:FONT, letterSpacing:"0.18em", color:OG }}>
                TÀI KHOẢN: {user.name.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGES */}
      {page==="home" && <HomePage onView={viewProduct} onAdd={p=>addToCart(p)} onNav={navigate} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>}
      {page==="shoes" && <ShoesPage onSelectCat={id=>navigate("products",id)}/>}
      {page==="products" && <ProductsPage initCat={initCat} onView={viewProduct} onAdd={p=>addToCart(p)} wishlist={wishlist} onToggleWishlist={toggleWishlist}/>}
      {page==="about" && <AboutPage/>}
      {page==="product" && selectedProduct && <ProductDetail product={selectedProduct} onBack={() => navigate(prevPage)} onAdd={(p,s)=>addToCart(p,s)} isWishlisted={wishlist.includes(selectedProduct.id)} onToggleWishlist={toggleWishlist}/>}
      {page==="profile" && user && <ProfilePage user={user} wishlist={wishlist} onToggleWishlist={toggleWishlist} onView={viewProduct} onAdd={p=>addToCart(p)} onLogout={() => { setUser(null); navigate("home"); }}/>}
      {page==="checkout" && <CheckoutPage cart={cart} onBack={() => setCartOpen(true)} onSuccess={info => { setOrderInfo(info); setCart([]); navigate("success"); }}/>}
      {page==="success" && orderInfo && <OrderSuccessPage orderCode={orderInfo.code} form={orderInfo.form} onHome={() => navigate("home")}/>}

      {/* FOOTER */}
      {!["checkout","success","auth"].includes(page) && (
        <footer className="bg-black text-white pt-16 pb-10 px-8 md:px-16" style={{ fontFamily:FONT }}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
              <div className="col-span-2 md:col-span-1">
                <button onClick={() => navigate("home")}>
                  <ImageWithFallback src={veloxLogo} alt="VELOX" className="h-7 w-auto object-contain mb-5" style={{ filter:"brightness(0) invert(1)" }}/>
                </button>
                <p className="text-xs text-white/40 leading-[1.8] max-w-[180px]" style={{ letterSpacing:"0.04em", wordSpacing:"0.05em" }}>Thiết kế cho những người vượt qua mọi giới hạn.</p>
                <div className="flex gap-4 mt-6">
                  {[Instagram,Twitter,Facebook,Youtube].map((Icon,i) => <a key={i} href="#" className="text-white/35 hover:text-[#E5521C] transition-colors"><Icon size={15} strokeWidth={1.5}/></a>)}
                </div>
              </div>
              {[
                { title:"MUA SẮM", links:[["Hàng Mới",""],["Giày","shoes"],["Sản Phẩm","products"],["Khuyến Mãi",""]] },
                { title:"HỖ TRỢ", links:[["Trạng Thái Đơn",""],["Đổi / Trả",""],["Vận Chuyển",""],["Bảng Size",""]] },
                { title:"CÔNG TY", links:[["Về VELOX","about"],["Tuyển Dụng",""],["Bền Vững",""]] },
                { title:"TÀI KHOẢN", links:[["Đăng Nhập","auth"],["Đăng Ký","auth"],["Yêu Thích","profile"],["Đơn Hàng","profile"]] },
              ].map(col => (
                <div key={col.title}>
                  <p className="text-[10px] font-black uppercase mb-5" style={{ letterSpacing:"0.22em" }}>{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(([link,pg]) => (
                      <li key={link}>
                        {pg ? <button onClick={() => navigate(pg as Page)} className="text-xs font-normal text-white/40 hover:text-[#E5521C] transition-colors text-left" style={{ letterSpacing:"0.04em", fontFamily:FONT }}>{link}</button>
                          : <a href="#" className="text-xs font-normal text-white/40 hover:text-[#E5521C] transition-colors" style={{ letterSpacing:"0.04em" }}>{link}</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-3">
              <p className="text-[10px] text-white/25 uppercase" style={{ letterSpacing:"0.12em" }}>© 2026 VELOX ATHLETICS. MỌI QUYỀN ĐƯỢC BẢO LƯU.</p>
              <p className="text-[10px] text-white/25 uppercase" style={{ letterSpacing:"0.12em" }}>ĐƯỢC THIẾT KẾ ĐỂ DI CHUYỂN.</p>
            </div>
          </div>
        </footer>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onQty={qtyChange} onRemove={removeItem} onCheckout={() => navigate("checkout")}/>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onView={viewProduct}/>
    </div>
  );
}
