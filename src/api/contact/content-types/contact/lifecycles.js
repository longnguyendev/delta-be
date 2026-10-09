const from = process.env.SMTP_USERNAME;

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    if (from)
      try {
        await Promise.all([
          strapi
            .plugin("email")
            .service("email")
            .send({
              to: from,
              from,
              subject: "Có người đăng kí mới",
              html: `<div style="color:#333333;font-family:helvetica,sans-serif;font-size:18px;font-weight:300;line-height:24px;max-width:650px;padding:30px">
              <img alt="Motion Array" src="https://thanhhauphat.com.vn/images/thanhhauphat.png" style="margin-bottom:30px" class="CToWUd" data-bit="iit" width="103"  height="60">
              <h2 style="font-size:40px;font-weight:300;line-height:40px;margin-bottom:20px">Có lượt đăng kí mới</h2>
              <div style="margin-bottom:48px;min-height:150px">
                <p>Hệ thống đã nhận được yêu cầu tư vấn từ ${result.name}</p>
                <p>Số điện thoại: ${result.phone}</p>
                <p>Email: ${result.email}</p>
                <p>Truy cập <a href="https://api.thanhhauphat.com.vn/admin">api.thanhhauphat.com.vn/admin</a> để kiểm tra ngay. </p>
              </div>
              <div style="border-top:6px solid #92d5e1;padding-top:12px">
                <a href="https://pioneervisa.com" style="color:#333;font-size:13px;font-weight:600;padding-right:12px;text-decoration:none;text-transform:uppercase" target="_blank">pioneervisa.com</a>
              </div>
            </div>`,
            }),
          strapi
            .plugin("email")
            .service("email")
            .send({
              to: result.email,
              from,
              subject: "Welcome to Thanh Hau Phat",
              html: `<div style="color:#333333;font-family:helvetica,sans-serif;font-size:18px;font-weight:300;line-height:24px;max-width:650px;padding:30px">
              <img alt="Motion Array" src="https://thanhhauphat.com.vn/images/thanhhauphat.png" style="margin-bottom:30px" class="CToWUd" data-bit="iit" width="103"  height="60">
              <h2 style="font-size:40px;font-weight:300;line-height:40px;margin-bottom:20px"> Xin chào ${result.name}! </h2>
              <div style="margin-bottom:48px;min-height:200px">
                <p>Hệ thống đã nhận được yêu cầu tư vấn từ bạn!</p>
                <p>Hãy chờ đợi trong giây lát, nhân viên của chúng tôi sẽ liên hệ bạn trong vòng 2 - 5 phút.</p>
                <p>Nếu bạn có bất kỳ câu hỏi nào khác, bạn cũng có thể xem trang hỗ trợ của chúng tôi hoặc gửi email cho chúng tôi. Chúng tôi muốn nghe ý kiến từ bạn.</p>
                <p>Trân trọng!.</p>
              </div>
              <div style="border-top:6px solid #92d5e1;padding-top:12px">
                <a href="https://thanhhauphat.com.vn/" style="color:#333;font-size:13px;font-weight:600;padding-right:12px;text-decoration:none;text-transform:uppercase" target="_blank">thanhhauphat.com.vn</a>
              </div>
            </div>`,
            }),
        ]);
      } catch (err) {
        console.log(err);
      }
  },
};
