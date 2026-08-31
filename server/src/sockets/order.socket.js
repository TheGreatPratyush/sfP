const ORDER_CREATED_EVENT = "order:created";

const emitOrderCreated = (io, order) => {
    io.emit(ORDER_CREATED_EVENT, { order });
};

module.exports = {
    emitOrderCreated
};
