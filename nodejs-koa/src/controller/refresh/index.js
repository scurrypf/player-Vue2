const { suc, failure } = require('../../utils/res');
const { verifyRefreshToken, createToken } = require('../../service/token')


function isRefreshToken(ctx){
    let refresh_token = ctx.request.body.refreshToken;
    if(verifyRefreshToken(refresh_token)){
        let token = createToken('kokomi', '123456');
        ctx.body = suc({ token });
    }else{
        ctx.body = failure('登录过期,请重新登录');
    }
}


module.exports = {
    isRefreshToken,
}