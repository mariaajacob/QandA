export let webAPIURL = "https://localhost:44386/api/questions"

export interface HttpRequest<REQB> {
    path: string;
    method?: string;
    body?: REQB;
}

export interface HttpResponse<RESB> extends Response {
    parsedBody?: RESB;
}
  
  export const http = <REQB, RESB>( config: HttpRequest<REQB>, ): Promise<HttpResponse<RESB>> => {
    return new Promise((resolve, reject) => {

        const request = new Request(`${webAPIURL}${config.path}`, {
            // mode: 'no-cors',
            method: config.method || 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            body: config.body ? JSON.stringify(config.body) : undefined,
        });

        let response: HttpResponse<RESB>;
        
        fetch(request)
        .then(res => {
            response = res;
            if(response.status >= 400){
                reject(response);
            }
            if ( res.headers.get('Content-Type') || ''.indexOf('json') > 0 ) {
                return res.json();
            } else {
                resolve(response);
            }
        })
        .then(body => {
            if (response.ok) {
                response.parsedBody = body;
                resolve(response);
            } else {
                reject(response);
            }
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
};