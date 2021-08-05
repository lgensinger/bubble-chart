import { hierarchy, pack } from "d3-hierarchy";
import { select } from "d3-selection";

import { configuration, configurationDimension } from "../configuration.js";

/**
 * BubbleChart is a area value visualization.
 * @param {array} data - objects where each represents a path in the hierarchy
 * @param {integer} height - artboard height
 * @param {integer} width - artboard width
 */
class BubbleChart {
    constructor(data, width=configurationDimension.width, height=configurationDimension.height) {

        // update self
        this.artboard = null;
        this.dataSource = data;
        this.height = height;
        this.label = null;
        this.name = configuration.name;
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
     * Position and minimally style labels in SVG dom element.
     */
    configureLabels() {

        // container
        this.label
            .attr("class", "lgv-label")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", "0.25em");

        // text items
        this.label
            .each((d, i, nodes) => {
                select(nodes[i])
                    .selectAll("tspan")
                    .data([d.data.name, d.data.value])
                    .enter()
                    .append("tspan")
                    .text(x => x)
                    .attr("x", 0)
                    .attr("dy", (x, j) => j == 0 ? "" : `${j * 1.25}em`);
            });

    }

    /**
     * Position and minimally style nodes in SVG dom element.
     */
    configureNodes() {
        this.node
            .append("circle")
            .attr("class", "lgv-node")
            .attr("r", d => d.r);
    }

    /**
     * Generate SVG artboard in the HTML DOM.
     * @param {node} domNode - HTML node
     * @returns A d3.js selection.
     */
    generateArtboard(domNode) {
        return select(domNode)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("class", this.name);
    }

    /**
     * Generate labels in SVG element.
     * @param {node} domNode - d3.js SVG selection
     */
    generateLabels(domNode) {
        return domNode
            .append("text");
    }

    /**
     * Construct node shapes in HTML DOM.
     * @param {node} domNode - HTML node
     * @returns A d3.js selection.
     */
    generateNodes(domNode) {
        return domNode.selectAll("g")
            .data(this.data ? this.data.leaves() : [])
            .join("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    }

    /**
     * Render visualization.
     * @param {node} domNode - HTML node
     */
    render(domNode) {

        // generate svg artboard
        this.artboard = this.generateArtboard(domNode);

        // generate group for each bubble
        this.node = this.generateNodes(this.artboard);

        // position/style nodes
        this.configureNodes();

        // generate labels
        this.label = this.generateLabels(this.node);

        // position/style labels
        this.configureLabels();

    }

};

export { BubbleChart };
export default BubbleChart;
