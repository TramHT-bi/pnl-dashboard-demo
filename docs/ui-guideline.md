# UI Guideline

## Design Philosophy

Dashboard phải mang phong cách:

- Modern
- Professional
- Executive Reporting
- Power BI Inspired

Ưu tiên:

- Dễ đọc
- Sạch sẽ
- Ít màu sắc
- Tập trung vào dữ liệu

---

# Color Palette

## Primary Color

Navy Blue

Hex:

#0c1a47

---

## Secondary Color

Blue

Hex:

#2563EB

---

## Background

Light Gray

Hex:

#EEF1F6

---

## Card Background

White

Hex:

#FFFFFF

---

## Positive Value

Green

Hex:

#16A34A

---

## Negative Value

Red

Hex:

#DC2626

---

# Typography

Font Family:

Inter

Fallback:

Segoe UI

Sans-serif

---

# Font Size

Page Title:

24px

Section Title:

18px

Card Label:

16px

Card Value:

35px

Table Content:

16px

Filter Label:

16px

Data Lable:

16px

Chart Unit:

12px

Chart Legend:

12px

Chart Axis Label:

12px

Chart Data Label:

12px
---

# Chart Visual Style

## Chart Title

Color:

#003A8C

Font Weight:

700

Text Transform:

Uppercase

Position:

Top left inside chart card

---

## Chart Unit Text

Position:

Directly below chart title

Color:

#0c1a47

Font Size:

12px

Font Weight:

500

Example:

Billion VND

---

## Chart Legend

Position:

Top area below chart title and unit

Text Color:

#0c1a47

Font Size:

12px

Marker Style:

- Line chart: line segment with circle point
- Bar chart: rounded square
- Donut chart: rounded square

---

## Axis Style

Axis Text Color:

#000000

Axis Font Weight:

600

Grid Line Color:

#E5EAF2

Y Axis Unit Label:

Show above the y-axis, left aligned

Example:

Billion VND

---

## Data Label Style

Display:

Always visible for key values

Font Size:

12px

Font Weight:

700

Line Chart Label Position:

Above or below each point to avoid overlap

Bar Chart Label Position:

Above each bar

Waterfall Label Position:

Above positive bars and below negative bars

Donut Label Position:

Inside segment, white text

Data Label Color Rules:

- Revenue / Actual / Current Year: #0057D9
- Last Year dashed series: #0057D9
- Gross Profit: #00A6B2
- Gross Margin %: #F58220
- Positive values: #16A34A
- Negative values: #DC2626
- Plan / LY comparison bar: #A6AEB8
- Total / EBIT / navy values: #0c1a47

---

## Chart Color Mapping

Primary Blue:

#0057D9

Navy:

#0c1a47

Teal:

#00A6B2

Orange:

#F58220

Green:

#43A047

Red:

#E53935

Gray:

#A6AEB8

Purple:

#7E57C2

Dark Gray:

#6B7280

---

## Line Style

Current Year / Actual Line:

Solid line

Last Year Line:

Dashed line

Line Width:

3px

Point Radius:

4px

Point Border:

White, 2px

---

## Bar Style

Bar Radius:

2px

Actual / Revenue Bar:

Blue

Plan / LY Bar:

Gray

Positive Waterfall Bar:

Green

Negative Waterfall Bar:

Red

Total Waterfall Bar:

Blue

---

## Donut Style

Cutout:

62%

Segment Colors:

- Blue
- Teal
- Orange
- Purple
- Gray

Center Label:

Show total value in navy

Center Sub Label:

Show 100% in navy

# Layout

## Sidebar

Position:

Left

Width:

220px

Background:

Navy Blue

Text Color:

White

---

## Main Content

Padding:

24px

---

## Gap Between Visuals

12px

---

# KPI Card

Background:

White

Border Radius:

12px

Shadow:

Light Shadow

Height:

120px

---

# Chart Container

Background:

White

Border Radius:

12px

Padding:

16px

Shadow:

Light Shadow

---

# Table Style

Header Background:

Navy Blue

Header Text:

White

Body Background:

White

Row Hover:

Light Blue

---

# Filter Style

Background:

White

Border Radius:

10px

Height:

40px

---

# Icon Style

Use:

Font Awesome

Size:

20px

---

# Responsive

Desktop First

Target Resolution:

1920 x 1080

Minimum Width:

1366px

---
# Viewport Behavior

The dashboard is designed for desktop landscape view.

At 1920 x 1080 and 100% browser zoom:

- Page 1 should fit within a single screen.
- No vertical scrolling should be required.
- KPI cards should remain in one row.
- Chart cards should reduce height proportionally to fit the viewport.
- Filters may use compact width and height to preserve chart space.
# Animation

Hover Effect:

Enabled

Duration:

0.2s

Chart Animation:

Enabled

Duration:

800ms
