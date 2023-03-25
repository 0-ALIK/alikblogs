export interface Blog {
  _id: string,
  titulo: string,
  contenido: string
  fecha: Date | string,
  portada: string,
  publicado: boolean,
  usuario: string
};

export interface Comentario {
  usuario: string,
  blog: string,
  fecha: Date | string,
  contenido: string
};

export interface Like {
  usuario: string,
  blog: string
};

export interface Usuario {
  _id?: string,
  correo: string,
  nombre: string,
  about?: string,
  img?: string,
  fecha?: Date | string,
  estado?: boolean
}

export interface Error {
  msg: string
}

export interface Response {
  cantidad: number,
  token: string,
  tokenRenovado: string,
  usuario: Usuario,
  usuarios: Usuario[],
  blog: Blog,
  blogs: Blog[],
  comentario: Comentario,
  comentarios: Comentario[],
  like: Like,
  errors: Error[]
};

