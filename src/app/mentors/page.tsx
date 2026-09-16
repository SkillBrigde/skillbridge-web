import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-PUB-01"
      screenTitle="Khám Phá Mentors & Bộ Lọc Kỹ Năng Kỹ Thuật Cao"
      module="Catalog & Discovery"
      actor="Mentee"
      description="Thị trường tìm kiếm mentor kỹ thuật, lọc theo công nghệ (.NET 10, Kafka, DevOps, AI), mức giá, và thời gian rảnh. Cam kết hoàn tiền 100% qua Smart Escrow nếu vắng mặt."
      features={[
        "Tìm kiếm tức thì theo tên, công ty (VNG, Techcombank), kỹ năng",
        "Bộ lọc mức giá đa phân khúc: < 500k, 500k - 1Tr, > 1Tr",
        "Chỉ hiển thị Verified Mentor đã qua xác minh sinh trắc học CCCD",
        "Hiển thị trực quan 3 gói dịch vụ đóng gói kèm giá cố định VND"
      ]}
    />
  );
}
