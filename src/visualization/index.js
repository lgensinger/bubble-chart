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
        this.container = null;
        this.dataSource = data;
        this.height = height;
        this.label = null;
        this.name = configuration.name;
        this.width = width;

        // using font size as the base unit of measure make responsiveness easier to manage across devices
        this.artboardUnit = typeof window === "undefined" ? 16 : parseFloat(getComputedStyle(document.body).fontSize);

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
        this.label
            .attr("class", "lgv-label")
            .attr("x", 0)
            .attr("y", 0)
            .each((d, i, nodes) => {
                select(nodes[i])
                    .selectAll("tspan")
                    .data([d.data.label, d.data.value])
                    .join(
                        enter => enter.append("tspan"),
                        update => update,
                        exit => exit.remove()
                    )
                    .text(x => x)
                    .attr("x", 0)
                    .attr("dy", (x, j) => j == 0 ? "-0.1em" : `${j * 1.2}em`);
            });
    }

    /**
     * Position and minimally style nodes in SVG dom element.
     */

    configureNodes() {
        this.node
            .selectAll("circle")
            .data(d => d)
            .join(
                enter => enter.append("circle"),
                update => update,
                exit => exit.remove()
            )
            .attr("class", "lgv-node")
            .attr("r", d => d.r)
            .on("click", (e,d) => {

                // send event to parent
                this.artboard.dispatch("nodeclick", {
                    bubbles: true,
                    detail: {
                        id: d.data.id,
                        label: d.data.label,
                        value: d.data.value,
                        xy: [e.clientX + (this.artboardUnit / 2), e.clientY + (this.artboardUnit / 2)]
                    }
                });

            })
            .on("mouseover", (e,d) => {

                // update class
                select(e.target).attr("class", "lgv-node active");

                // send event to parent
                this.artboard.dispatch("nodemouseover", {
                    bubbles: true,
                    detail: {
                        id: d.data.id,
                        label: d.data.label,
                        value: d.data.value,
                        xy: [e.clientX + (this.artboardUnit / 2), e.clientY + (this.artboardUnit / 2)]
                    }
                });

            })
            .on("mouseout", (e,d) => {

                // update class
                select(e.target).attr("class", "lgv-node");

                // send event to parent
                this.artboard.dispatch("nodemouseout", {
                    bubbles: true
                });

            });
    }

    /**
     * Generate SVG artboard in the HTML DOM.
     * @param {selection} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateArtboard(domNode) {
        return domNode
            .selectAll("svg")
            .data([{height: this.height, width: this.width}])
            .join(
                enter => enter.append("svg"),
                update => update,
                exit => exit.remove()
            )
            .attr("viewBox", d => `0 0 ${d.width} ${d.height}`)
            .attr("class", this.name);
    }

    /**
     * Generate labels in SVG element.
     * @param {node} domNode - d3.js SVG selection
     */
    generateLabels(domNode) {
        return domNode
            .selectAll("text")
            .data(d => d)
            .join(
                enter => enter.append("text"),
                update => update,
                exit => exit.remove()
            );
    }

    /**
     * Construct node shapes in HTML DOM.
     * @param {selection} domNode - d3 selection
     * @returns A d3.js selection.
     */
    generateNodes(domNode) {
        return domNode
            .selectAll("g")
            .data(this.data ? this.data.leaves() : [])
            .join(
                enter => enter.append("g"),
                update => update,
                exit => exit.remove()
            )
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
    }

    /**
     * Generate visualization.
     * @param {styles} object - key/value pairs where each key is a CSS property and corresponding value is its value
     */
    generateVisualization(styles) {

        // generate svg artboard
        this.artboard = this.generateArtboard(this.container);

        // generate group for each bubble
        this.node = this.generateNodes(this.artboard);

        // position/style nodes
        this.configureNodes();

        // generate labels
        this.label = this.generateLabels(this.node);

        // position/style labels
        this.configureLabels();

        // style bars from provided
        this.styleNodes(styles);

    }

    /**
     * Render visualization.
     * @param {node} domNode - HTML node
     * @param {styles} object - key/value pairs where each key is a CSS property and corresponding value is its value
     */
    render(domNode, styles) {

        // update self
        this.container = select(domNode);

        // generate visualization
        this.generateVisualization(styles);

    }

    /**
     * Style nodes in SVG dom element.
     */
    styleNodes(styles = null) {

        // check if provided
        if (styles) {

            // add each declared style
            for (const key in styles) {
                this.node
                    .selectAll("circle")
                    .attr(key, styles[key]);
            }

        }

    }

    /**
     * Update visualization.
     * @param {object} data - key/values where each key is a series label and corresponding value is an array of values
     * @param {integer} height - height of artboard
     * @param {integer} width - width of artboard
     * @param {styles} object - key/value pairs where each key is a CSS property and corresponding value is its value
     */
    update(data, width, height, styles) {

        // update self
        this.dataSource = data;
        this.height = height;
        this.width = width;

        // generate visualization
        this.generateVisualization(styles);

    }

};

export { BubbleChart };
export default BubbleChart;
