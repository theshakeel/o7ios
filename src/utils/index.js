import mixpanel from "mixpanel-browser";
import { updateUserData } from "../store/slice/user";
import { updateLoader } from "../store/slice/loading";
import { getCountryCategoryEvents } from "../services/data/events";
import { getEvents } from "../store/slice/events";
import { toast } from "react-hot-toast";
export const initializeMixpanel = () => {
  mixpanel.init(process.env.REACT_APP_MIX_PANEL_TOKEN);
};

export const handleCategorySelect = async (
  item,
  searchKey,
  dispatch,
  countryId
) => {
  dispatch(updateLoader({ loader: true }));
  dispatch(updateUserData({ category: item }));
  getCountryCategoryEvents({
    page: 1,
    number: 12,
    country: countryId,
    category: item.id,
    searchKey,
  }).then((res) => {
    dispatch(getEvents(res?.data?.data));
    dispatch(updateLoader({ loader: false }));
  });
};
export const notify = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  custom: (msg) => toast(msg, { icon: "🔔" }),
};