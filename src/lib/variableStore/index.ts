// valla = variable colla
export const valla = {
    shop: {
        ITEMS: "SERENITY:SHOPITEMS",
        INFO: "SERENITY:SHOPINFO",
        ALL_IDS: "SERENITY:ALL_IDS",
        ALL_TITLES: "SERENITY:ALL_TITLES",
    }
}
const sideBarList = [
    {
        title: 'หน้าหลัก',
        goto: '',
        icon: 'mdi:house-circle'
    },
    {
        title: 'เติมเงิน',
        goto: '/topup',
        icon: 'mdi:gold'
    },
    {
        title: 'กรอกรหัสคูปอง',
        goto: '/redeem',
        icon: 'mdi:ticket-confirmation'
    }
];
export {sideBarList}