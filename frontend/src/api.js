import axios from "axios";
import { LocalStorageKeys } from "./common/constants";

axios.defaults.baseURL =
  window.location.protocol + "//" + window.location.hostname + ":8000/api/v1/";

// intercept 401 errors, and attempt to get new access token, otherwise redirect to signin
function set401Interceptor(on401) {
  axios.interceptors.response.use(null, (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      error.response.data.code === "token_not_valid" &&
      error.response.data.messages
    ) {
      return Auth.refresh(localStorage.getItem(LocalStorageKeys.REFRESH))
        .then((refreshResponse) => {
          const access = refreshResponse.data.access;
          const config = {
            ...error.config,
            headers: { ...error.headers, Authorization: "Bearer " + access },
          };
          setAccess(access);
          return axios.request(config);
        })
        .catch(() => {
          on401();
          return Promise.reject(error);
        });
    } else {
      return Promise.reject(error);
    }
  });
}

const setAccess = (access) => {
  if (access != null) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + access;
    localStorage.setItem(LocalStorageKeys.ACCESS, access);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem(LocalStorageKeys.ACCESS);
  }
};

const Auth = {
  login: ({ email, password }) => {
    return axios.post("/auth/login", {
      username: email,
      password,
    });
  },
  // needs email, password, firstName, lastName, postcode, birthYear
  register: function ({
    email,
    password,
    firstName,
    lastName,
    postcode,
    birthYear,
  }) {
    return axios.post("/auth/register", arguments[0]);
  },
  refresh: (refresh) => {
    return axios.post("/auth/refresh", { refresh });
  },
  forgotPassword: (email) => {
    return axios.post("/auth/forgot-password", { email });
  },
  resetPassword: (resetInfo) => {
    return axios.post("/auth/reset-password", { resetInfo });
  },
};

const Participants = {
  currentUser: () => {
    return axios.get("participant/current-user");
  },
  update: (
    participantId,
    { firstName, lastName, email, postcode, birthYear }
  ) => {
    return axios.patch(`/participant/${participantId}`, {
      firstName,
      lastName,
      email,
      postcode,
      birthYear,
    });
  },
};

const SupportItems = {
  get: ({
    birthYear,
    postcode,
    supportCategoryID,
    registrationGroupID = null,
  }) => {
    return axios.get(
      `/support-items?birth-year=${birthYear}&postcode=${postcode}&support-category-id=${supportCategoryID}&registration-groupid=${registrationGroupID}`
    );
  },
};

const Hcp_SupportItems = {
  get: ({
    // birthYear,
    // postcode,
    hcpsupportCategoryID,
    // hcpregistrationGroupID = null,
  }) => {
    return axios.get(
      `/hcp-support-items?hcp-support-category-id=${hcpsupportCategoryID}`
    );
  },
};

const SupportItemGroups = {
  get: ({
    // todo: involve the following in the filter
    // birthYear,
    // postcode,
    supportCategoryID,
    registrationGroupID = null,
  }) => {
    return axios.get(
      `/support-item-groups?support-category-id=${supportCategoryID}&registration-groupid=${registrationGroupID}`
    );
  },
};
const Hcp_SupportItemGroups = {
  get: ({
    // todo: involve the following in the filter
    // birthYear,
    // postcode,
    supportCategoryID,
    registrationGroupID = null,
  }) => {
    return axios.get(
      `/hcp-support-item-groups?hcp-support-category-id=${supportCategoryID}&hcp-registration-groupid=${registrationGroupID}`
    );
  },
};
const SupportGroups = {
  all: () => {
    return axios.get("/support-groups");
  },
};

const SupportCategories = {
  list: () => {
    return axios.get("/support-categories");
  },
};


const Hcp_SupportGroups = {
  all: () => {
    return axios.get("/hcp-support-groups");
  },
};

const Hcp_SupportCategories = {
  list: () => {
    return axios.get("/hcp-support-categories");
  },
};

const Plans = {
  list: () => {
    return axios.get("/plans");
  },
  create: ({ name, ndisNumber, startDate, endDate, supportCategories }) => {
    return axios.post("/plans", {
      name,
      ndisNumber,
      startDate,
      endDate,
      supportCategories,
    });
  },
  update: (
    planId,
    { name, ndisNumber, startDate, endDate, planCategories }
  ) => {
    return axios.patch(`/plans/${planId}`, {
      name,
      ndisNumber,
      startDate,
      endDate,
      planCategories,
    });
  },
};

const Hcp_Plans = {
  list: () => {
    return axios.get("/hcpplans");
  },
  create: ({ name, startDate, endDate, hcpSupportCategories }) => {
    return axios.post("/hcpplans", {
      name,
      startDate,
      endDate,
      hcpSupportCategories,
    });
  },
  update: (
    hcpPlanId,
    { name, startDate, endDate, hcpPlanCategories }
  ) => {
    return axios.patch(`/hcpplans/${hcpPlanId}`, {
      name,
      startDate,
      endDate,
      hcpPlanCategories,
    });
  },
};

const PlanItems = {
  list: (planId, planCategoryId, planItemGroupId) => {
    return axios.get(
      `/plans/${planId}/categories/${planCategoryId}/groups/${planItemGroupId}/items`
    );
  },
  create: (
    planId,
    planCategoryId,
    planItemGroupId,
    { planitemGroup, name, priceActual, startDate, endDate, allDay }
  ) => {
    return axios.post(
      `/plans/${planId}/categories/${planCategoryId}/groups/${planItemGroupId}/items`,
      {
        planitemGroup,
        name,
        priceActual,
        startDate,
        endDate,
        allDay,
      }
    );
  },
  delete: (planItemId) => {
    return axios.delete(`/plan-items/${planItemId}`);
  },
  update: (
    planId,
    planCategoryId,
    planItemGroupId,
    planItemId,
    { name, priceActual, startDate, endDate, allDay }
  ) => {
    return axios.patch(
      `/plans/${planId}/categories/${planCategoryId}/groups/${planItemGroupId}/items/${planItemId}`,
      {
        name,
        priceActual,
        startDate,
        endDate,
        allDay,
      }
    );
  },
};

const Hcp_PlanItems = {
  list: (planId, planCategoryId, planItemGroupId) => {
    return axios.get(
      `/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups/${planItemGroupId}/hcpitems`
    );
  },
  create: (
    planId,
    planCategoryId,
    planItemGroupId,
    { planItemGroup, name, priceActual, startDate, endDate, allDay }
  ) => {
    return axios.post(
      `/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups/${planItemGroupId}/hcpitems`,
      {
        planItemGroup,
        name,
        priceActual,
        startDate,
        endDate,
        allDay,
      }
    );
  },
  delete: (planItemId) => {
    return axios.delete(`/hcp-plan-items/${planItemId}`);
  },
  update: (
    planId,
    planCategoryId,
    planItemGroupId,
    planItemId,
    { name, priceActual, startDate, endDate, allDay }
  ) => {
    return axios.patch(
      `/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups/${planItemGroupId}/hcpitems/${planItemId}`,
      {
        name,
        priceActual,
        startDate,
        endDate,
        allDay,
      }
    );
  },
};

const PlanItemGroups = {
  list: (planId, planCategoryId) => {
    return axios.get(`/plans/${planId}/categories/${planCategoryId}/groups`);
  },
  create: (
    planId,
    planCategoryId,
    { planCategory, supportItemGroup, name }
  ) => {
    return axios.post(`/plans/${planId}/categories/${planCategoryId}/groups`, {
      planCategory,
      supportItemGroup,
      name,
    });
  },
  update: (planId, planCategoryId, planItemGroupId, { name }) => {
    return axios.patch(
      `/plans/${planId}/categories/${planCategoryId}/groups/${planItemGroupId}`,
      {
        name,
      }
    );
  },
};
const Hcp_PlanItemGroups = {
  list: (planId, planCategoryId) => {
    return axios.get(`/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups`);
  },
  create: (
    planId,
    planCategoryId,
    { hcpPlanCategory, hcpSupportItemGroup, name,nickname }
  ) => {
    return axios.post(`/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups`, {
      hcpPlanCategory,
      hcpSupportItemGroup,
      name,
      nickname,
    });
  },
  update: (planId, planCategoryId, planItemGroupId, { name }) => {
    return axios.patch(
      `/hcpplans/${planId}/hcpcategories/${planCategoryId}/hcpgroups/${planItemGroupId}`,
      {
        name,
      }
    );
  },
};

const Hcp_PlanCategory = {
  list: (planId) => {
    return axios.get(`/hcpplans/${planId}/hcpcategories`);
  },
  create: (
      budget,
      planId,
      planCategoryId,
      name,
  ) => {
    return axios.post(`/hcpplans/${planId}/hcpcategories`, {
      budget,
      planId,
      planCategoryId,
      name,
    });
  },
  update: (
      planId,
      planCategoryId,
      name
  ) => {
    return axios.patch(
      `/hcpplans/${planId}/hcpcategories/${planCategoryId}`,
      {
        name
      }
    );
  },
};



const RegistrationGroups = {
  list: () => {
    return axios.get("/registration-groups");
  },
};
const Hcp_RegistrationGroups = {
  list: () => {
    return axios.get("/hcp-registration-groups");
  },
};
export default {
  Auth,
  Participants,
  SupportGroups,
  Hcp_SupportGroups,
  SupportCategories,
  Hcp_PlanCategory,
  Hcp_SupportCategories,
  SupportItems,
  Hcp_SupportItems,
  SupportItemGroups,
  Hcp_SupportItemGroups,
  Plans,
  Hcp_Plans,
  PlanItems,
  Hcp_PlanItems,
  PlanItemGroups,
  Hcp_PlanItemGroups,
  RegistrationGroups,
  Hcp_RegistrationGroups,
  setAccess,
  set401Interceptor,
};
