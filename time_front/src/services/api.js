import axios from 'axios';

export default class Api {
  token = 'x123456a54565s';

  createFormData(formData, key, data) {
    if (data === Object(data) || Array.isArray(data)) {
      for (var i in data) {
        this.createFormData(formData, key + '[' + i + ']', data[i]);
      }
    } else {
      formData.append(key, data);
    }
  }

  post(url, dados) {
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    console.log(process.env.VUE_APP_ROOT_API + url);
    return axios
      .post(process.env.VUE_APP_ROOT_API + url, dados, header)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error.response;
        // this.redirectError(error.response.status);
      });
  }

  get(url) {
    return axios.get(process.env.VUE_APP_ROOT_API + url).then(response => {
      return response.data;
    });
  }

  getUrlCompleta(url) {
    return axios.get(url).then(response => {
      return response.data;
    });
  }

  file(url, dados) {
    return axios
      .post(process.env.VUE_APP_ROOT_API + url, dados, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Api-Token': this.token,
        },
      })
      .then(response => {
        return response.data;
      });
  }

  impressao(url, dados) {
    return axios({
      url: process.env.VUE_APP_ROOT_API + url,
      method: 'POST',
      data: dados,
      headers: {
        Accept: 'application/pdf',
        'Api-Token': this.token,
      },
      responseType: 'blob',
    }).then(response => {
      return response;
    });
  }

  redirectError(statusCode) {
    switch (parseInt(statusCode)) {
      case 401:
        window.location = '/erro/401';
        break;
      case 404:
      default:
        window.location = '/erro/404';
        break;
    }
  }

  // Add a response interceptor
  requisicao = axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      if (
        window.location.pathname !== '/erro/401' &&
        window.location.pathname !== '/erro/404' &&
        window.location.pathname.indexOf('/validar') === -1
      ) {
        switch (parseInt(error.response.status)) {
          case 401:
            if (
              error.response.data.response === 'token_empty' ||
              error.response.data.response === 'token_invalid'
            ) {
              localStorage.removeItem('token');
              localStorage.removeItem('nome_usuario');
              localStorage.removeItem('HASH_USER');
              window.location = '/';
            } else if (error.response.data.response === 'token_expired') {
              if (localStorage.getItem('HASH_USER')) {
                new Api()
                  .getUrlCompleta(
                    'http://URL/acesso_login.php?id=' + localStorage.getItem('HASH_USER')
                  )
                  .then(response => {
                    if (response.blLogado) {
                      // refresh token
                      new Api()
                        .get('../../ValidarLogin/' + localStorage.getItem('HASH_USER'))
                        .then(response => {
                          const token = response.response.token;
                          const nomeUsuario = response.response.nome;
                          localStorage.setItem('token', token);
                          localStorage.setItem('nome_usuario', nomeUsuario);
                          error.config.headers['Api-Token'] = token;
                          return axios.request(error.config);
                        })
                        .catch(error => {
                          console.log(error);
                          window.location = '/';
                        });
                    } else {
                      localStorage.removeItem('token');
                      localStorage.removeItem('nome_usuario');
                      localStorage.removeItem('HASH_USER');
                      window.location = '/';
                    }
                  });
              } else {
                localStorage.removeItem('token');
                localStorage.removeItem('nome_usuario');
                localStorage.removeItem('HASH_USER');
                window.location = '/';
              }
            }
            break;
          case 404:
            Object.noty.error('URL inexistente, entrar em contato com o desenvolvimento.', 'error');
            break;
          case 408:
            Object.noty.error('Erro ao acessar a API, entrar em contato com o desenvolvimento!');
            break;
          case 500:
            Object.noty.error('Erro ao acessar a API, entrar em contato com o desenvolvimento!');
            break;
          default:
            return Promise.reject(error);
        }
      }
    }
  );
}
