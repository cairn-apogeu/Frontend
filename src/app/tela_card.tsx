import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { BsFillCheckCircleFill, BsHourglassTop } from "react-icons/bs";

export default function MyPage() {
  const [description, setDescription] = useState('');
  const [dod, setDod] = useState('');
  const [dor, setDor] = useState('');
  const [negocios, setNegocios] = useState('');
  const [arquitetura, setArquitetura] = useState('');
  const [frontend, setFrontend] = useState('');
  const [backend, setBackend] = useState('');
  const [design, setDesign] = useState('');
  const [dataAnalytics, setDataAnalytics] = useState('');
  const [previstos, setPrevistos] = useState('');
  const [executados, setExecutados] = useState('');
  const [linkApoio, setLinkApoio] = useState('');


  return (
    <div className="bg-gray-900 text-white h-screen flex">
      <div className="w-64 bg-gray-800 p-4">
        <div className="flex items-center mb-4">
          <IoIosArrowBack size={24} />
          <span className="ml-2 text-lg font-bold">Project Name</span>
        </div>
    
        <div>
          {/* adicionar os incones(lembrete) */}
        </div>
      </div>
      <div className="flex-grow p-8">
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-full w-6 h-6 mr-2 flex justify-center items-center">
                <div className="text-white font-bold text-sm">•</div>
              </div>
              <h2 className="text-lg font-bold">Diagrama de sequência KanBan</h2>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Assign to
            </button>
          </div>
          <p className="text-gray-400 mb-2">17/11/2024</p>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="description">Descrição</label>
            <textarea className="bg-gray-600 text-white rounded w-full p-2" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-1" htmlFor="dod">DOD</label>
              <textarea className="bg-gray-600 text-white rounded w-full p-2" id="dod" value={dod} onChange={(e) => setDod(e.target.value)}></textarea>
            </div>
            <div>
              <label className="block text-gray-400 mb-1" htmlFor="dor">DOR</label>
              <textarea className="bg-gray-600 text-white rounded w-full p-2" id="dor" value={dor} onChange={(e) => setDor(e.target.value)}></textarea>
            </div>
          </div>
        </div>
        <div className="ml-8 mt-4 bg-gray-700 rounded-lg p-6 w-96">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">Tempo</h3>
            <div className="flex items-center">
              <BsHourglassTop className="mr-2 text-yellow-500" />
              <input type="text" className="w-16 bg-gray-600 text-white rounded p-2 text-center" value={previstos} onChange={(e) => setPrevistos(e.target.value)} placeholder="min"/>
              <BsFillCheckCircleFill className="mx-2 text-green-500" />
              <input type="text" className="w-16 bg-gray-600 text-white rounded p-2 text-center" value={executados} onChange={(e) => setExecutados(e.target.value)} placeholder="min"/>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1" htmlFor="linkApoio">Conteúdo de Apoio</label>
            <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="linkApoio" value={linkApoio} onChange={(e) => setLinkApoio(e.target.value)} placeholder="Link"/>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Atributos</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="negocios">Negócios</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="negocios" value={negocios} onChange={(e) => setNegocios(e.target.value)}/>
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="arquitetura">Arquitetura</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="arquitetura" value={arquitetura} onChange={(e) => setArquitetura(e.target.value)}/>
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="frontend">FrontEnd</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="frontend" value={frontend} onChange={(e) => setFrontend(e.target.value)}/>
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="backend">BackEnd</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="backend" value={backend} onChange={(e) => setBackend(e.target.value)}/>
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="design">Design</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="design" value={design} onChange={(e) => setDesign(e.target.value)}/>
              </div>
              <div>
                <label className="block text-gray-400 mb-1" htmlFor="dataAnalytics">Data Analytics</label>
                <input type="text" className="bg-gray-600 text-white rounded w-full p-2" id="dataAnalytics" value={dataAnalytics} onChange={(e) => setDataAnalytics(e.target.value)}/>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Salvar</button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}