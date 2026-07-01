# Project Information

Project Name:

P&L Dashboard Demo

---

# Project Objective
Là môt BI developer, xây dựng dashboard mô phỏng báo cáo P&L dành cho Ban Giám Đốc.

Dashboard giúp người dùng:

- Theo dõi doanh thu
- Theo dõi chi phí
- Theo dõi lợi nhuận
- Phân tích nguyên nhân tăng giảm lợi nhuận
- Xác định sản phẩm, khu vực và kênh bán hàng đóng góp hiệu quả nhất

Dashboard chỉ dùng để trình bày layout và luồng tương tác trước khi triển khai Power BI thực tế.

---

# Target Users

Primary Users:

- CEO
- CFO
- Finance Director
- Business Director

Secondary Users:

- Finance Team
- Sales Team

---

# Business Questions

Dashboard phải trả lời được các câu hỏi:

1. Doanh thu hiện tại là bao nhiêu?

2. Doanh thu có đạt kế hoạch không?

3. Doanh thu tăng hay giảm so với năm trước?

4. Chi phí nào đang chiếm tỷ trọng lớn nhất?

5. EBIT hiện tại là bao nhiêu?

6. Khu vực nào đóng góp doanh thu nhiều nhất?

7. Kênh bán hàng nào hiệu quả nhất?

8. Sản phẩm nào tạo ra lợi nhuận cao nhất?

---

# Scope

Dashboard gồm 5 trang:

1. Executive Summary
2. Revenue Analysis
3. Cost Analysis
4. Profitability Analysis
5. P&L Statement

---

# Data Source

Hiện tại chưa có dữ liệu thật.

Sử dụng dữ liệu giả lập.

Không cần kết nối cơ sở dữ liệu.

---

# Filter Requirements

Người dùng phải có thể lọc theo:

- Date
- Region
- Channel
- Product
- Customer Group
- Account (dành cho trang P&L Statement và Cost Analysis )

Timeframe:

- MTD
- QTD
- YTD

---

# KPI Requirements

Executive Summary phải bao gồm:

- Revenue
- Direct Cost
- Gross Margin
- Indirect Cost
- EBIT
- Total Cost
- MoTC

Revenue Analysis phải bao gồm:

- Revenue
- Plan
- Var
- Ach %
- LY
- YoY
- Revenue per Order
- Revenue per Headcount

Profitability Analysis phải bao gồm:

- EBIT
- EBIT %
- Gross Margin
- Gross Margin %

---

# Interaction Requirements

Khi người dùng thay đổi filter:

- KPI phải cập nhật
- Chart phải cập nhật
- Table phải cập nhật

Tất cả visual phải đồng bộ.

---

# UI Requirements

Theme:

- White
- Navy Blue

Style:

- Modern
- Corporate
- Power BI Inspired
# Time-based Chart Filtering Logic

For charts that display data by month, the x-axis must always show the full year from January to December.

When the user selects a specific Month filter:

- Current Year / Actual series must display data from January up to the selected month only.
- Months after the selected month must be blank for Current Year / Actual series.
- Last Year series must continue to display full-year data from January to December.
- Plan series must continue to display full-year data from January to December.

Example:

If Month = May:

- Current Year Revenue: show Jan to May only, Jun to Dec blank.
- Last Year Revenue: show Jan to Dec.
- Plan Revenue: show Jan to Dec.

This rule applies to time-based charts such as:

- Revenue Trend
- Gross Profit Trend
- Actual Revenue vs Plan Revenue
---

# Deliverables

Tạo:

- HTML
- CSS
- JavaScript

Cấu trúc code phải dễ bảo trì.

Comment rõ ràng.

Responsive cho màn hình:

1920 x 1080