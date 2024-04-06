const parser = require('lambda-multipart-parser');

module.exports.parseFormData = async(data) => {
    const parsed_data = await parser.parse(data);
    console.log("====>parsed_data", parsed_data)
    return parsed_data
}
