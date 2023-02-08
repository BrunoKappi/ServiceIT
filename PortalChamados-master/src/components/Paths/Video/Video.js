import React from 'react'
import "./Video.css"
import Logo from '../../../images/logoPreto.png'
import { Link } from 'react-router-dom'

export default function Video() {
    return (

        <div className='VideoContainter'>
            <Link className='BackLink' to="/">
                <img className="LogoLogin" src={Logo} alt="" />
            </Link>

            <iframe title='Apresentação' className='VideoPlayer' height="345" src="https://www.youtube.com/embed/wjsirzpAl4o">
            </iframe>
            <Link className='BackLink' to="/">Voltar</Link>
        </div>


    )
}
