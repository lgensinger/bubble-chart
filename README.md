# Bubble Chart

ES6 d3.js bubble chart visualization.


## Style

Style is expected to be addressed via css. The top-level svg is assigned a class `lgv-bubble-chart`. Any style not met by the visualization module is expected to be added by the importing component.

## Environment Variables

The following values can be set via environment or passed into the class.

| Name | Type | Description |
| :-- | :-- | :-- |
| `DIMENSION_HEIGHT` | integer | height of artboard |
| `DIMENSION_WIDTH` | integer | width of artboard |

## Install

```bash
# install package
npm install @lgv/bubble-chart
```

## Data Format

The following values are the expected input data structure.

```json
[
    {
        id: 1,
        label: "xyz",
        value: 1
    },
    {
        id: 2,
        label: "abc",
        value: 3
    }
]
```

## Use Module

```bash
import { BubbleChart } from "@lgv/bubble-chart";

// initialize
const bc = new BubbleChart(data);

// render visualization
bc.render(document.body);
```
