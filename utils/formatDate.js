import moment from "moment";

const date_format = (value, format) => {
    return moment(value).format(format);
};

export default date_format;
