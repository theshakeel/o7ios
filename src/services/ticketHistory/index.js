import axios from "axios";

const getOldTickets = async (props) => {
  const { token, page, number } = props;
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/my-old-tickets?page=${page}&number=${number}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getUpcomingTickets = async (props) => {
  const { token, page, number } = props;
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/my-upcoming-tickets?page=${page}&number=${number}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const getUpcomingTicketsS = async (props) => {
  const { token, page, number } = props;
  let data = await axios({
    method: "get",
    url: `https://admin.o7events.com/api/dummy-old-tickets`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("data i am returning for tickets ", data)
  let res = {
  "status": true,
  "data": {
    "current_page": 1,
    "data": data.data,
    "first_page_url": "https://admin.o7events.com/api/my-old-tickets?page=1",
    "from": null,
    "last_page": 1,
    "last_page_url": "https://admin.o7events.com/api/my-old-tickets?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://admin.o7events.com/api/my-old-tickets?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "https://admin.o7events.com/api/my-old-tickets",
    "per_page": 12,
    "prev_page_url": null,
    "to": null,
    "total": 0
  }
}
  return res
};
const getTicketDetails = async (token, id) => {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/ticket-details/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getOldTickets, getUpcomingTickets, getTicketDetails };
