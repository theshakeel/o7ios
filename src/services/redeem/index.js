import axios from "axios";

const scanQrCode = async(data, token) => {
    return await axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/redeem`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });    
}
export {scanQrCode}