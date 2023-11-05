import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { useTrabajadores } from '../context/TrabajadorContext';
import { useClientes } from '../context/ClienteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';

function NewCasaPage() {
  return (
    <div>NewCasaPage</div>
  )
}

export default NewCasaPage