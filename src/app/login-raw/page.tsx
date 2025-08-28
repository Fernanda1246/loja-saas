export default function LoginRawPage() {
    return (
      <div style={{maxWidth: 420, margin: "40px auto", fontFamily: "system-ui"}}>
        <h1>Login RAW (teste)</h1>
        <form
          method="POST"
          action="/api/auth/login"
          encType="application/x-www-form-urlencoded"
          style={{display: "grid", gap: 12, marginTop: 16}}
        >
          <input type="hidden" name="redirect" value="/dashboard" />
          <label>Email
            <input name="email" type="email" required style={{width:"100%",height:40,padding:"0 10px"}} />
          </label>
          <label>Senha
            <input name="password" type="password" required style={{width:"100%",height:40,padding:"0 10px"}} />
          </label>
          <button type="submit" style={{height:44}}>Entrar</button>
        </form>
      </div>
    );
  }
  