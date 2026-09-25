const MarkdownIt = require("markdown-it");
const yaml = require("js-yaml");
const md = new MarkdownIt({ html: true, linkify: true, breaks: false });

module.exports = function (eleventyConfig) {
eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

eleventyConfig.addPassthroughCopy({ "src/images": "images" });
eleventyConfig.addPassthroughCopy({ "src/css": "css" });
eleventyConfig.addPassthroughCopy({ admin: "admin" });

eleventyConfig.addFilter("markdown", (value) => {
                                   if (!value) return "";
                                   return md.render(value);
                                   });

eleventyConfig.addFilter("markdownInline", (value) => {
                                         if (!value) return "";
                                         return md.renderInline(value);
                                         });

return {
dir: {
input: "src",
includes: "_includes",
data: "_data",
output: "_site",
},
};
};
