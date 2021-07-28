import test from "ava";

import { configurationDimension } from "../src/configuration.js";
import { BubbleChart } from "../src/index.js";

/******************** EMPTY VARIABLES ********************/

// initialize
let bc = new BubbleChart();

// TEST INIT //
test("init", t => {

    t.true(bc.height === configurationDimension.height);
    t.true(bc.width === configurationDimension.width);

});

// TEST get DATA //
test("get_data", t => {

    t.true(typeof(bc.data) == "object");

});

// TEST get LAYOUT //
test("get_layout", t => {

    t.true(typeof(bc.layout) == "function");

});

// TEST RENDER //
test("render", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    bc.render(document.body);

    // get generated element
    let artboard = document.querySelector(".lgv-bubble-chart");

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == configurationDimension.height);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == configurationDimension.width);

});

/******************** DECLARED PARAMS ********************/

let testWidth = 300;
let testHeight = 500;
let testData = [
    {label: "xyz", id: 1, value: 1},
    {label: "abc", id: 2, value: 4}
];

// initialize
let bct = new BubbleChart(testData, testWidth, testHeight);

// TEST INIT //
test("init_params", t => {

    t.true(bct.height === testHeight);
    t.true(bct.width === testWidth);

});

// TEST get DATA //
test("get_data_params", t => {

    t.true(typeof(bct.data) == "object");

});

// TEST get LAYOUT //
test("get_layout_params", t => {

    t.true(typeof(bct.layout) == "function");

});

// TEST RENDER //
test("render_params", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    bct.render(document.body);

    // get generated element
    let artboard = document.querySelector(".lgv-bubble-chart");

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == testHeight);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == testWidth);

});
