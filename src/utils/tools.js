
export const formatNumber = (val = "") => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}