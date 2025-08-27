export const verifyAccountTemplate = (otp) => {
  return `
    <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      background-color:#f9f9f9;padding:20px;text-align:center;">
      
      <div style="max-width:480px;margin:auto;background:#ffffff;
        border-radius:12px;padding:32px 24px;border:1px solid #e6ecf0;">
        
        <div style="margin-bottom:20px;">
          <img src="https://abs.twimg.com/icons/apple-touch-icon-192x192.png" 
               alt="X Logo" width="48" height="48"/>
        </div>

        <h2 style="color:#0f1419;margin-bottom:8px;font-size:22px;">
          Verify your account
        </h2>

        <p style="color:#536471;font-size:15px;line-height:1.5;margin-bottom:24px;">
          Use the following verification code to complete your sign-in. 
          The code is valid for <strong>3 minutes</strong>.
        </p>

        <div style="font-size:28px;font-weight:600;letter-spacing:6px;
          color:#1DA1F2;margin:20px 0;">
          ${otp}
        </div>

        <p style="color:#536471;font-size:13px;margin-top:12px;">
          If you didn’t request this code, you can safely ignore this email.
        </p>
      </div>

      <p style="color:#8899a6;font-size:12px;margin-top:20px;">
        &copy; ${new Date().getFullYear()} X Corp. All rights reserved.
      </p>
    </div>
  `;
};

export const resetPasswordTemplate = (otp) => {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      background-color:#f9f9f9;padding:20px;text-align:center;">

      <div style="max-width:480px;margin:auto;background:#ffffff;
        border-radius:12px;padding:32px 24px;border:1px solid #e6ecf0;">

        <div style="margin-bottom:20px;">
          <img src="https://abs.twimg.com/icons/apple-touch-icon-192x192.png" 
               alt="X Logo" width="48" height="48"/>
        </div>

        <h2 style="color:#0f1419;margin-bottom:8px;font-size:22px;">
          Password Reset Request
        </h2>

        <p style="color:#536471;font-size:15px;line-height:1.5;margin-bottom:24px;">
          Use the following One-Time Password (OTP) to reset your password.  
          This code is valid for <strong>5 minutes</strong>.
        </p>

        <div style="font-size:28px;font-weight:600;letter-spacing:6px;
          color:#1DA1F2;margin:20px 0;">
          ${otp}
        </div>

        <p style="color:#536471;font-size:13px;margin-top:16px;">
          If you didn’t request a password reset, you can safely ignore this email.
        </p>
      </div>

      <p style="color:#8899a6;font-size:12px;margin-top:20px;">
        &copy; ${new Date().getFullYear()} X Corp. All rights reserved.
      </p>
    </div>
  `;
};


export const welcomeTemplate = (fullName) => {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
      background-color:#f9f9f9;padding:20px;text-align:center;">

      <div style="max-width:480px;margin:auto;background:#ffffff;
        border-radius:12px;padding:32px 24px;border:1px solid #e6ecf0;">
        
        <div style="margin-bottom:20px;">
          <img src="https://abs.twimg.com/icons/apple-touch-icon-192x192.png" 
               alt="X Logo" width="48" height="48"/>
        </div>

        <h2 style="color:#0f1419;margin-bottom:8px;font-size:22px;">
          Welcome to X, ${fullName} 👋
        </h2>

        <p style="color:#536471;font-size:15px;line-height:1.5;margin-bottom:24px;">
          We’re excited to have you on board! Start connecting, sharing, 
          and exploring conversations that matter to you.
        </p>

        <a href="https://x.com" style="display:inline-block;
          background-color:#1DA1F2;color:#fff;text-decoration:none;
          font-weight:600;padding:12px 24px;border-radius:9999px;">
          Get Started
        </a>
      </div>

      <p style="color:#8899a6;font-size:12px;margin-top:20px;">
        &copy; ${new Date().getFullYear()} X Corp. All rights reserved.
      </p>
    </div>
  `;
};
