import * as barberService from "~/services/barberService";

export const BarberAPI = {
  getAll: async () => {
    const result = await barberService.getAllBarbers();
    return result.barbers;
  },

  assignUser: async (payload) => {
    return await barberService.assignUserAsBarber(payload);
  },

  assignBranch: async (payload) => {
    return await barberService.assignBarberToBranch(payload);
  },

  lock: async (idBarber) => {
    return await barberService.lockBarber({ idBarber });
  },

  unlock: async (idBarber) => {
    return await barberService.unlockBarber({ idBarber });
  },
  
  getReward: async (idBarber) => {
    const result = await barberService.getBarberReward(idBarber);
    return result;
  },
};
