export interface Blog {
  _id: string,
  titulo: string,
  contenido: string
  fecha: Date,
  portada: string,
  publicado: boolean,
  usuario: Usuario
};

export interface Comentario {
  _id: string
  usuario?: Usuario,
  blog?: Blog,
  fecha: Date,
  contenido: string
};


export interface Usuario {
  _id?: string,
  correo?: string,
  nombre: string,
  about?: string,
  img?: string,
  fecha?: Date,
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

  errors: Error[]
};

