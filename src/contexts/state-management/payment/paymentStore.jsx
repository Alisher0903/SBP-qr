import create from "zustand";

export const PaymentStore = create((set) => ({
    paymentData: [],
    setPaymentData: (data) => set({paymentData: data}),
    isEdit: false,
    setIsEdit: (data) => set({isEdit: data}),
    totalPage: 0,
    setTotalPages: (val) => set({ totalPage: val }),
    page: 0,
    setPage: (val) => set({ page: val }),
    size: 10,
    setSize: (val) => set({ size: val }),
}))