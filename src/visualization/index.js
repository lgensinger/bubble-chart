import { hierarchy, pack } from "d3-hierarchy";
import { select } from "d3-selection";

import { configurationDimension } from "../configuration.js";

/**
 * BubbleChart is a area value visualization.
 * @param {array} data - objects where each represents a path in the hierarchy
 * @param {integer} height - artboard height
 * @param {integer} width - artboard width
 */
class BubbleChart {
    constructor(data, width=configurationDimension.width, height=configurationDimension.height) {

        // update self
        this.dataSource = data;
        this.height = height;
        this.width = width;

    }

    /**
     * Condition data for visualization requirements.
     * @returns A xx.
     */
    get data() {
        return this.layout(hierarchy({ children: this.dataSource})
            .sum(d => d.value));
    }

    /**
     * Construct layout.
     * @returns A d3 pack layout function.
     */
    get layout() {
        return pack()
            .size([this.width - 2, this.height - 2])
            .padding(3);
    }

    /**
     * Render visualization.
     * @param {node} domNode - HTML node
     */
    render(domNode) {

        // generate svg artboard
        let artboard = select(domNode)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("class", "lgv-bubble-chart");

        // generate group for each bubble
        const node = artboard.selectAll("g")
            .data(this.data.leaves())
            .join("g")
            .attr("id", d => `lgv-node-${d.data.id}`)
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        // generate node
        node.append("circle")
            .attr("class", "lgv-bubble-chart-bubble")
            .attr("r", d => d.r);

        // generate label
        node.append("text")
            .attr("class", "lgv-bubble-chart-label")
            .attr("x", 0)
            .attr("y", "0.5em")
            .text(d => d.data.name);

    }

};

export { BubbleChart };
export default BubbleChart;
