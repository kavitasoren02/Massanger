
export const READ_STATUS = Object.freeze({
    SINGLE_TICK:'single_tick',
    DOUBLE_TICK:'double_tick',
    BLUE_DOUBLE_TICK:'blue_double_tick'
}as const);

export type readStatus = typeof READ_STATUS[keyof typeof READ_STATUS];