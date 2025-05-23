// authrite-js.d.ts
declare module "authrite-js" {
  // Define the shape of the configuration object used in the constructor
  interface AuthriteConfig {
    clientPrivateKey: string
    initialRequestPath?: string
    signingStrategy?: string
    certificates?: any[] // Adjust the type based on the actual structure of certificates
  }

  // Define the shape of the fetch configuration object
  interface FetchConfig {
    headers?: { [key: string]: string }
    method?: string
    body?: string | object | Buffer
  }

  // Define the shape of the response object
  interface AuthriteResponse {
    status: number
    ok: boolean // Indicates whether the response was successful (status in the range 200-299)
    headers: { [key: string]: string }
    body: ArrayBuffer

    // Method to parse JSON from the response body
    json<T = any>(): Promise<T> // You can specify a generic type for better type checking
  }

  // Define the shape of the certificate object
  interface Certificate {
    // Define the properties of the certificate based on the actual structure
  }

  // Define the Authrite class
  class Authrite {
    constructor(config?: AuthriteConfig)

    request(
      requestUrl: string,
      fetchConfig?: FetchConfig
    ): Promise<AuthriteResponse>
    connect(connectionUrl: string, config?: object): Promise<any>
    on(event: string, callback: Function): void
    emit(event: string, data: object | string | Buffer): void
    addCertificate(certificate: Certificate): void
  }

  export {
    Authrite,
    AuthriteConfig,
    FetchConfig,
    AuthriteResponse,
    Certificate,
  }
}
