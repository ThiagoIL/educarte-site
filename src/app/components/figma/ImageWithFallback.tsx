import React from 'react'
import { Image } from '../Image'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, className, style, ...rest } = props

  return (
    <Image 
      src={src || ""} 
      alt={alt || "Imagem"} 
      className={className} 
      style={style} 
      {...rest} 
    />
  )
}

