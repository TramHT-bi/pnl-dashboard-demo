# Dashboard Layout

## General Layout

Screen Size:

1920 x 1080

Theme:

- White
- Navy Blue

Navigation:

- Vertical Sidebar
- Left side

Sidebar Menu:

1. Executive Summary
2. P&L Statement
3. Revenue Analysis
4. Cost Analysis
5. Profitability Analysis


---

## Common Area

All pages must contain:

### Filters

Position:

Top of page

Top Bar Layout:

- Page Name and Filters must be in the same horizontal row
- Page Name must be left aligned
- Filters and Timeframe Buttons must be right aligned
- For Page 1, "Executive Summary" must be horizontally aligned with the slicers

Page Name
Filters:

- Date
- Region
- Channel
- Product
- Customer Group
- Account (dành cho page P&L Statement và Cost Analysis)
Timeframe Buttons:

- MTD
- QTD
- YTD

---

## Common Chart Styling

Chart titles:

- Uppercase
- Navy / dark blue text
- Font weight 700
- Positioned at top left of chart card

Chart unit:

- Show directly below chart title
- Use small text
- Color: Navy / dark blue

Legend:

- Place below title and unit, above plot area
- Text color: Navy / dark blue
- Use line markers for line charts
- Use square markers for bar and donut charts

Axis:

- X-axis and Y-axis label color: Black
- Grid line color: Light gray
- Y-axis unit label must be visible at top-left of plot area

Data labels:

- Show key data labels directly on lines, bars, waterfall bars, and donut segments
- Font weight: 700
- Font size: 12px
- Line labels use the same color as the line series
- Bar labels appear above bars
- Waterfall labels appear above positive bars and below negative bars
- Donut labels appear inside segments with white text

Default chart colors:

- Primary blue: #0057D9
- Navy: #0c1a47
- Teal: #00A6B2
- Orange: #F58220
- Green: #43A047
- Red: #E53935
- Gray: #A6AEB8
- Purple: #7E57C2
- Dark gray: #6B7280

---

# Page 1 - Executive Summary

## Text Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px                                                               │
│ ┌────────────────┐  MAIN CONTENT                                             │
│ │ P&L Dashboard  │  ┌──────────────────────────────────────────────────────┐ │
│ │                │  │ Executive Summary   [Date From] [Date To] [Region]  │ │
│ │ ● Executive    │  │                     [Channel] [Product] [Customer]  │ │
│ │   Summary      │  │                     [MTD] [QTD] [YTD]               │ │
│ │ ○ P&L Statement│  └──────────────────────────────────────────────────────┘ │
│ │ ○ Revenue      │                                                          │
│ │ ○ Cost         │  SECTION 1                                    │
│ │ ○ Profit       │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ └────────────────┘  │Revenue │ │Direct  │ │Gross   │ │Indirect│ │EBIT    │ │
│                     │LY YoY  │ │LY YoY  │ │LY YoY  │ │LY YoY  │ │LY YoY  │ │
│                     └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│                     ┌────────┐ ┌────────┐                                  │
│                     │Total   │ │MoTC    │                                  │
│                     │Cost    │ │LY YoY  │                                  │
│                     └────────┘ └────────┘                                  │
│                                                                              │
│                     SECTION 2                                      │
│                     ┌──────────────────────┐ ┌────────────────────────────┐ │
│                     │ Revenue Trend        │ │ Gross Profit Trend         │ │
│                     │ CY vs LY Line Chart  │ │ CY vs LY vs GM Line Chart  │ │
│                     └──────────────────────┘ └────────────────────────────┘ │
│                                                                              │
│                     SECTION 3                                      │
│                     ┌──────────────────────┐ ┌────────────────────────────┐ │
│                     │ Actual vs Plan       │ │ Component Breakdown        │ │
│                     │ Clustered Bar Chart  │ │ Waterfall Chart            │ │
│                     └──────────────────────┘ └────────────────────────────┘ │
│                                                                              │
│                     SECTION 4                                │
│                     ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│                     │ Top 10 Product │ │ Revenue Region │ │ Revenue      │ │
│                     │ Bar Chart      │ │ Donut Chart    │ │ Channel Donut│ │
│                     └────────────────┘ └────────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Section 1 - KPI Cards

Layout:

7 KPI cards in one row

KPIs:

- Revenue
- Direct Cost
- Gross Margin
- Indirect Cost
- EBIT
- Total Cost
- MoTC
tính số LY và %YoY của từng chỉ số
---

## Section 2 - Trends

Layout:

2 charts in one row

Left:

Revenue Trend ( Current Year vs Last Year)

Type:

Line Chart

Unit of measurement:

Billion (VND)

Visual style:

- Current Year Revenue: solid blue line (#0057D9)
- Last Year Revenue: dashed blue line (#0057D9)
- Line width: 3px
- Point marker: circle, blue fill, white border
- Data labels: blue, bold, show value above or below each point
- Legend labels: "CY Revenue" and "LY Revenue"

Right:

Gross Profit Trend ( Current Year vs Last Year vs Current Gross Margin)

Type:

Line Chart

Unit of measurement:

Billion (VND) and %

Visual style:

- Current Year Gross Profit: solid teal line (#00A6B2)
- Last Year Gross Profit: dashed teal line (#00A6B2)
- Current Gross Margin %: solid orange line (#F58220), use right y-axis
- Line width: 3px
- Point marker: circle, series color fill, white border
- Data labels: same color as each series
- Left y-axis unit: Billion VND
- Right y-axis unit: %
- Legend labels: "CY Gross Profit", "LY Gross Profit", "Gross Margin % (CY)"
---

## Section 3 - Trends

Layout:

2 charts in one row

Left:

Actual Revenue vs Plan Revenue

Type:

Clustered Bar Chart

Unit of measurement:

Billion (VND)

Visual style:

- Actual Revenue bar: blue (#0057D9)
- Plan Revenue bar: gray (#A6AEB8)
- Bar radius: 2px
- Data labels: bold, above each bar
- Actual data labels: blue
- Plan data labels: dark gray
- Legend labels: "Actual Revenue" and "Plan Revenue"

Right:

Component Breakdown (revenue, direct cost, gross margin, indirect cost, ebit)

Type: 

Waterfall

Unit of measurement:

Billion (VND)

Visual style:

- Revenue and EBIT total bars: blue (#0057D9)
- Gross Margin positive bar: green (#43A047)
- Direct Cost and Indirect Cost negative bars: red (#E53935)
- Connector lines: gray dashed
- Data labels: bold
- Positive/total labels: above bars, navy or matching bar color
- Negative labels: below bars, navy or red
- Legend: hidden
---
## Section 4 - Distribution
Layout:
 3 charts in one row
Left:
Top 10 Product by revenue

Type:

Clustered Bar Chart

Unit of measurement:

Billion (VND)

Visual style:

- Horizontal bars: blue (#0057D9)
- Data labels: show value and contribution where applicable
- Value labels: navy / dark blue
- Bar labels: black
- Total row: highlighted with navy text and dotted border

Middle:

Revenue By Region

Type:

Donut

Unit of measurement:

%

Visual style:

- Segment colors: blue, teal, orange, purple, gray
- Data labels: white, bold, inside segments
- Center label: total revenue in navy
- Center sub label: 100% in navy
- Legend: right side with value and percentage

Right: Revenue by Channel

Type:

Donut

Unit of measurement:

%

Visual style:

- Segment colors: blue, teal, orange, purple, gray
- Data labels: white, bold, inside segments
- Center label: total revenue in navy
- Center sub label: 100% in navy
- Legend: right side with value and percentage
--- 
# Page 2 - P&L Statement
## Text WireFrame
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px                                                               │
│ ┌────────────────┐  MAIN CONTENT                                             │
│ │ P&L Dashboard  │  ┌──────────────────────────────────────────────────────┐ │
│ │                │  │ P&L Statement       [Date From] [Date To] [Region]  │ │
│ │ ○ Executive    │  │                     [Channel] [Product] [Customer]  │ │
│ │   Summary      │  │                     [Account] [MTD] [QTD] [YTD]     │ │
│ │ ● P&L Statement│  └──────────────────────────────────────────────────────┘ │
│ │ ○ Revenue      │                                                          │
│ │ ○ Cost         │  SECTION 1 - KPI CARDS                                    │
│ │ ○ Profit       │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ └────────────────┘  │Revenue │ │Direct  │ │Gross   │ │Indirect│ │EBIT    │ │
│                     │LY YoY  │ │Cost    │ │Margin  │ │Cost    │ │LY YoY  │ │
│                     └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│                     ┌────────┐ ┌────────┐                                  │
│                     │Total   │ │MoTC    │                                  │
│                     │Cost    │ │LY YoY  │                                  │
│                     └────────┘ └────────┘                                  │
│                                                                              │
│                     SECTION 2 - MATRIX                                      │
│ ┌──────────────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ CATEGORIES / ACCOUNT BY MONTH        │ │ CATEGORIES / ACCOUNT COMPARISON │ │
│ │ Unit: Billion VND / %                │ │ Unit: Billion VND / %           │ │
│ │                                      │ │                                 │ │
│ │ ┌────────────────────┬────┬────┬───┐│ │ ┌────────────────────┬────┬───┐ │ │
│ │ │ Category / Account │Jan │Feb │...││ │ │ Category / Account │ CY │LY │ │ │
│ │ ├────────────────────┼────┼────┼───┤│ │ ├────────────────────┼────┼───┤ │ │
│ │ │ Revenue            │    │    │   ││ │ │ Revenue            │    │   │ │ │
│ │ │   Product Sales    │    │    │   ││ │ │   Product Sales    │    │   │ │ │
│ │ │   Service Revenue  │    │    │   ││ │ │   Service Revenue  │    │   │ │ │
│ │ │   Other Income     │    │    │   ││ │ │   Other Income     │    │   │ │ │
│ │ │ Direct Cost        │    │    │   ││ │ │ Direct Cost        │    │   │ │ │
│ │ │   Material         │    │    │   ││ │ │   Material         │    │   │ │ │
│ │ │   Labor            │    │    │   ││ │ │   Labor            │    │   │ │ │
│ │ │   Packaging        │    │    │   ││ │ │   Packaging        │    │   │ │ │
│ │ │   Freight          │    │    │   ││ │ │   Freight          │    │   │ │ │
│ │ │ Gross Profit       │    │    │   ││ │ │ Gross Profit       │    │   │ │ │
│ │ │ Indirect Cost      │    │    │   ││ │ │ Indirect Cost      │    │   │ │ │
│ │ │   Marketing        │    │    │   ││ │ │   Marketing        │    │   │ │ │
│ │ │   Salary           │    │    │   ││ │ │   Salary           │    │   │ │ │
│ │ │   Office Rent      │    │    │   ││ │ │   Office Rent      │    │   │ │ │
│ │ │   Utilities        │    │    │   ││ │ │   Utilities        │    │   │ │ │
│ │ │ EBIT               │    │    │   ││ │ │ EBIT               │    │   │ │ │
│ │ │ EBIT %             │    │    │   ││ │ │ EBIT %             │    │   │ │ │
│ │ │ MoTC %             │    │    │   ││ │ │ MoTC %             │    │   │ │ │
│ │ │ Net Profit         │    │    │   ││ │ │ Net Profit         │    │   │ │ │
│ │ └────────────────────┴────┴────┴───┘│ │ └────────────────────┴────┴───┘ │ │
│ │ Columns:                             │ │ Columns:                        │ │
│ │ Category / Account | Jan | Feb | Mar │ │ Category / Account | Current CY │ │
│ │ Apr | ... | Dec | TimeFrame Total    │ │ Last Year | Variance | %YoY     │ │
│ └──────────────────────────────────────┘ └─────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
## Section 1 - KPI Cards

Layout:

7 KPI cards in one row

KPIs:

- Revenue
- Direct Cost
- Gross Margin
- Indirect Cost
- EBIT
- Total Cost
- MoTC
tính số LY và %YoY của từng chỉ số
---
## Section 2: Matrix

2 Matrix in one row

Left:

Categories/Account by Month

Rows:

Revenue
    Product Sales
    Service Revenue
    Other Income

Direct Cost
    Material
    Labor
    Packaging
    Freight
Gross Profit
Indirect Cost
    Marketing
    Salary
    Office Rent
    Utilities
EBIT
EBIT%
MoTC%
Net Profit

Columns:

Jan
Feb
Mar
Apr
...
Dec
TimeFrame (YTD/QTD/MTD)

Right:

Categories/Account Comparision

Rows:

Revenue
    Product Sales
    Service Revenue
    Other Income

Direct Cost
    Material
    Labor
    Packaging
    Freight
Gross Profit
Indirect Cost
    Marketing
    Salary
    Office Rent
    Utilities
EBIT
EBIT%
MoTC%
Net Profit

Columns:

Current Year (YTD/QTD/MTD)
Last Year
Varian
%YoY

# Page 3 - Revenue Analysis
## Text Wireframe
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px                                                               │
│ ┌────────────────┐  MAIN CONTENT                                             │
│ │ P&L Dashboard  │  ┌──────────────────────────────────────────────────────┐ │
│ │                │  │ Revenue Analysis    [Date From] [Date To] [Region]  │ │
│ │ ○ Executive    │  │                     [Channel] [Product] [Customer]  │ │
│ │   Summary      │  │                     [MTD] [QTD] [YTD]               │ │
│ │ ○ P&L Statement│  └──────────────────────────────────────────────────────┘ │
│ │ ● Revenue      │                                                          │
│ │   Analysis     │  SECTION 1 - KPI CARDS                                    │
│ │ ○ Cost         │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ ○ Profit       │  │Revenue │ │Plan    │ │Variance│ │Achieve │ │LY      │ │
│ └────────────────┘  │        │ │Revenue │ │        │ │%       │ │        │ │
│                     └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│                     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│                     │YoY     │ │EBIT %  │ │Revenue │ │        │            │
│                     │        │ │        │ │/ Order │ │        │            │
│                     └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                                              │
│                     SECTION 2 - TREND                                       │
│                     ┌────────────────────────────┐ ┌──────────────────────┐ │
│                     │ ACTUAL REVENUE VS PLAN     │ │ REVENUE VS LY        │ │
│                     │ REVENUE VS ACHIEVEMENT %   │ │ VS YOY %             │ │
│                     │ Unit: Billion VND / %      │ │ Unit: Billion VND / %│ │
│                     │                            │ │                      │ │
│                     │ Clustered Column + Line    │ │ Clustered Column +   │ │
│                     │ By Month                   │ │ Line By Month        │ │
│                     └────────────────────────────┘ └──────────────────────┘ │
│                                                                             │
│                     SECTION 3 - DISTRIBUTION                                │
│                     ┌────────────────────────────┐ ┌──────────────────────┐ │
│                     │ REVENUE BY REGION          │ │ REVENUE BY CHANNEL   │ │
│                     │ Unit: Billion VND / %      │ │ Unit: Billion VND / %│ │
│                     │                            │ │                      │ │
│                     │ ┌────────────┐ ┌─────────┐ │ │ ┌────────┐ ┌───────┐ │ │
│                     │ │ Donut      │ │ Mini    │ │ │ │ Donut  │ │ Mini  │ │ │
│                     │ │ Chart      │ │ Table   │ │ │ │ Chart  │ │ Table │ │ │
│                     │ └────────────┘ └─────────┘ │ │ └────────┘ └───────┘ │ │
│                     │ Mini Table Columns:        │ │ Mini Table Columns:  │ │
│                     │ CY | % Contribution | Plan │ │ CY | % Contribution  │ │
│                     │ %Ach|LY|%YoY               │ │ Plan|%Ach|LY | %YoY  │ │
│                     └────────────────────────────┘ └──────────────────────┘ │
│                                                                             │
│                     SECTION 4 - PRODUCT / CUSTOMER ANALYSIS                 │
│                     ┌────────────────────────────┐ ┌──────────────────────┐ │
│                     │ TOP 10 PRODUCT REVENUE     │ │ REVENUE BY CUSTOMER  │ │
│                     │ Unit: Billion VND / %      │ │ GROUP                │ │
│                     │                            │ │ Unit: Billion VND / %│ │
│                     │ ┌────────────┐ ┌─────────┐ │ │ ┌────────┐ ┌───────┐ │ │
│                     │ │ Clustered  │ │ Mini    │ │ │ │ Donut  │ │ Mini  │ │ │
│                     │ │ Bar Chart  │ │ Table   │ │ │ │ Chart  │ │ Table │ │ │
│                     │ └────────────┘ └─────────┘ │ │ └────────┘ └───────┘ │ │
│                     │ Mini Table Columns:        │ │ Mini Table Columns:  │ │
│                     │ CY | % Contribution | Plan │ │ CY | % Contribution  │ │
│                     │ %Ach|LY|%YoY               │ │ Plan|%Ach|LY | %YoY  │ │
│                     └────────────────────────────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

## Section 1 - KPI

Layout:

9 KPI cards

KPIs:

- Revenue
- Plan Revenue
- Variance
- Achivement %
- LY
- YoY
- EBIT %
- Revenue / Order

---

## Section 2 - Trend

Layout:

2 charts in one row

Left:

Actual Revenue vs Plan Revenue vs % Achivement by Month

Type: Line and clustered column chart

Line: % Achivement
Column: Actual Revenue vs Plan Revenue
Right:

Current Revenue vs Last Year Revenue vs %YoY

Type: Line and clustered column chart
Line: %YoY
Column: Current Revenue vs Last Year Revenue
---

## Section 3 - Distribution

Layout:

2 charts in one row

Left:

Revenue by Region

Type: 

Donut & mini table (CY,% Contribution, Plan, %Ach, LY, %YoY)

Right:

Revenue by Channel

Type: 

Donut & mini table (CY,% Contribution, Plan, %Ach, LY, %YoY)
---

## Section 4 - Distribution

Layout:

2 charts in one row

Left:

Top 10 Product Revenue

Type: 

Cluster Bar Chart & mini table (CY,% Contribution, Plan, %Ach, LY, %YoY)

Right:

Revenue by Customer Group

Donut & mini table (CY,% Contribution, Plan, %Ach, LY, %YoY)

---

# Page 4 - Cost Analysis
## Text WireFrame
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px                                                               │
│ ┌────────────────┐  MAIN CONTENT                                             │
│ │ P&L Dashboard  │  ┌──────────────────────────────────────────────────────┐ │
│ │                │  │ Cost Analysis       [Date From] [Date To] [Region]  │ │
│ │ ○ Executive    │  │                     [Channel] [Product] [Customer]  │ │
│ │   Summary      │  │                     [Account] [MTD] [QTD] [YTD]     │ │
│ │ ○ P&L Statement│  └──────────────────────────────────────────────────────┘ │
│ │ ○ Revenue      │                                                          │
│ │   Analysis     │  SECTION 1 - KPI CARDS                                    │
│ │ ● Cost         │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │   Analysis     │  │Total   │ │Plan    │ │Variance│ │Achieve │ │LY      │ │
│ │ ○ Profit       │  │Cost    │ │Cost    │ │        │ │%       │ │        │ │
│ └────────────────┘  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│                     ┌────────┐ ┌────────┐                                  │
│                     │% vs LY │ │Cost /  │                                  │
│                     │        │ │Order   │                                  │
│                     └────────┘ └────────┘                                  │
│                                                                              │
│                     SECTION 2 + SECTION 3                                    │
│ ┌──────────────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ SECTION 3 - MONTHLY COST TREND       │ │ SECTION 2 - VARIANCE MATRIX     │ │
│ │ Unit: Billion VND                    │ │ Unit: Billion VND / %           │ │
│ │                                      │ │                                 │ │
│ │ Line Chart:                          │ │ ┌────────────────────┬────┬───┐│ │
│ │ Actual Cost vs Plan Cost vs LY       │ │ │ Category / Account │Act │...││ │
│ │ X-axis: Jan ... Dec                  │ │ ├────────────────────┼────┼───┤│ │
│ └──────────────────────────────────────┘ │ │ Direct Cost        │    │   ││ │
│ ┌──────────────────────────────────────┐ │ │   Material         │    │   ││ │
│ │ COST STRUCTURE BY MONTH              │ │ │   Labor            │    │   ││ │
│ │ Unit: %                              │ │ │   Packaging        │    │   ││ │
│ │                                      │ │ │   Freight          │    │   ││ │
│ │ 100% Stacked Column Chart            │ │ │ Indirect Cost      │    │   ││ │
│ │ X-axis: Jan ... Dec                  │ │ │   Marketing        │    │   ││ │
│ │ Series: Cost components              │ │ │   Salary           │    │   ││ │
│ └──────────────────────────────────────┘ │ │   Office Rent      │    │   ││ │
│                                          │ │   Utilities        │    │   ││ │
│                                          │ │ Total Cost         │    │   ││ │
│                                          │ └────────────────────┴────┴───┘│ │
│                                          │ Columns:                        │ │
│                                          │ Act | Plan | Var vs Plan        │ │
│                                          │ %Ach | LY | % vs LY             │ │
│ └──────────────────────────────────────┘ └─────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
## Section 1 - KPI

Layout:

7 KPI cards

KPIs:

- Total Cost
- Plan Cost
- Variance
- Achivement %
- LY
- % vs LY
- Cost/Order
## Section 2 - Variance Matrix

Full Width

Columns:

- Act
- Plan
- Var vs Plan
- % Ach
- LY
- % vs LY

Rows: 

Direct Cost
    Material
    Labor
    Packaging
    Freight
Indirect Cost
    Marketing
    Salary
    Office Rent
    Utilities
Total Cost

---

## Section 3: 

Layout:

2 charts in one column

Top left:

Monthly Cost Trend (Actual Cost, Plan Cost, Last Year)
Type: 
Line Chart

Bottom left: 

Cost Structure by Month

Type:

100% Stacked Column Chart

---

# Page 5 - Profitability Analysis

## Text WireFrame

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR 220px                                                               │
│ ┌────────────────┐  MAIN CONTENT                                             │
│ │ P&L Dashboard  │  ┌──────────────────────────────────────────────────────┐ │
│ │                │  │ Profitability Analysis [Date From] [Date To] [Region]│ │
│ │ ○ Executive    │  │                        [Channel] [Product] [Customer]│ │
│ │   Summary      │  │                        [MTD] [QTD] [YTD]             │ │
│ │ ○ P&L Statement│  └──────────────────────────────────────────────────────┘ │
│ │ ○ Revenue      │                                                          │
│ │ ○ Cost         │  SECTION KPI                                             │
│ │ ● Profit       │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐ │
│ └────────────────┘  │ EBIT       │ │ EBIT %     │ │ GM         │ │ GM %   │ │
│                     │ LY / %YoY  │ │ LY         │ │ LY / %YoY  │ │ LY     │ │
│                     └────────────┘ └────────────┘ └────────────┘ └────────┘ │
│                                                                              │
│                     SECTION 1                                                │
│                     ┌──────────────────────────┐ ┌─────────────────────────┐ │
│                     │ %GM VS %EBIT BY MONTH    │ │ GM BY CHANNEL           │ │
│                     │ Unit: %                  │ │ Unit: Billion VND / %   │ │
│                     │ Line Chart               │ │ Donut + Mini Table      │ │
│                     │ Series: GM %, EBIT %     │ │ Columns: Revenue | GM   │ │
│                     │                          │ │ %GM                     │ │
│                     └──────────────────────────┘ └─────────────────────────┘ │
│                                                                              │
│                     SECTION 2                                                │
│                     ┌──────────────────────────┐ ┌─────────────────────────┐ │
│                     │ GM BY REGION             │ │ GM BY CUSTOMER GROUP    │ │
│                     │ Unit: Billion VND / %    │ │ Unit: Billion VND / %   │ │
│                     │ Donut + Mini Table       │ │ Donut + Mini Table      │ │
│                     │ Columns: Revenue | GM    │ │ Columns: Revenue | GM   │ │
│                     │ %GM                      │ │ %GM                     │ │
│                     └──────────────────────────┘ └─────────────────────────┘ │
│                                                                              │
│                     SECTION 3                                                │
│                     ┌──────────────────────────┐ ┌─────────────────────────┐ │
│                     │ GM BY TOP 10 PRODUCTS   │ │ PRODUCT PROFITABILITY   │ │
│                     │ Unit: Billion VND / %   │ │ Unit: Billion VND / %   │ │
│                     │ Clustered Bar + Table   │ │ Scatter Chart           │ │
│                     │ Columns: Revenue | GM   │ │ X: Revenue              │ │
│                     │ %GM                     │ │ Y: %GM | Size: GM       │ │
│                     └──────────────────────────┘ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:

- Account filter is not shown on Profitability Analysis.
- KPI cards compare with LY and show %YoY / pp variance.
- Donut and bar analysis cards include mini table columns: `Revenue | GM | %GM`.
- Product Profitability scatter uses `Revenue` on X-axis, `%GM` on Y-axis, and bubble size by `Gross Margin`.

# KPI

- EBIT
- EBIT %
- GM
- GM %
so sánh với LY và tính % YoY
---

## Charts
## Section 1
2 charts in one row
Left: 
 %GM vs %EBIT by Month

Type :

Line Chart

Right: 

GM by Channel

Type

Donut and mini table (Revenue, GM, %GM)

## Section 2:

2 charts in one row
Left:
GM by Region
Type: 
Donut and mini table (Revenue, GM, %GM)
Right: 
GM by Customer Group
Type: 
Donut and mini table (Revenue, GM, %GM)
## Section 3:
2 charts in one row
Left: GM by top 10 Products
Type: Clustered bar chart and mini table (Revenue, GM, %GM)
Right: Product Profitability
Type: Scatter
x axis: revenue
y axis: %GM
Size: Gross Margin


---


