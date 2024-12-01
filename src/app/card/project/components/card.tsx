import React, { useState } from 'react';
import SideNav from '@/app/components/sideNav';
import { IoChevronBack } from 'react-icons/io5';
import Link from 'next/link';

interface FormData {
    descricao: string;
    tempo: string;
    conteudoDeApoio: string;
    negocios: string;
    arquitetura: string;
    frontend: string;
    backend: string;
    design: string;
    dataAnalytics: string;
    dod: string;
    dor: string;
}

const MinhaPagina: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        descricao: "",
        tempo: "",
        conteudoDeApoio: "",
        negocios: "",
        arquitetura: "",
        frontend: "",
        backend: "",
        design: "",
        dataAnalytics: "",
        dod: "",
        dor: "",
    });

    const [title, setTitle] = useState("Diagrama de sequência Kanban");
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const { name, value } = e.currentTarget;
            setFormData({
                ...formData,
                [name]: value + "\n- "
            });
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        if (value === "") {
            setFormData({
                ...formData,
                [name]: "- "
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
    };

    return (
        <div className="flex min-h-screen bg-[#1F1F1F] text-gray-300">
            
            <div className="flex-grow ml-16 py-8 px-8">
                <div className="max-w-[1200px] mx-auto">
                    

                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#2D2D2D] p-6 rounded-md shadow-md relative space-y-8" style={{ width: "85%" }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                {isEditingTitle ? (
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={handleTitleChange}
                                        onBlur={handleTitleBlur}
                                        className="bg-[#404040] p-2 rounded-md text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500"
                                        autoFocus
                                    />
                                ) : (
                                    <p
                                        className="text-lg font-semibold text-gray-200 cursor-pointer"
                                        onClick={() => setIsEditingTitle(true)}
                                    >
                                        {title}
                                    </p>
                                )}
                                <p className="text-sm text-gray-400">17/11/2024</p>
                            </div>
                            <Link href="#" className="text-blue-400 hover:underline">
                                Assign to
                            </Link>
                        </div>

                        {/* Campos principais */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Coluna Esquerda: Descrição, DOD e DOR */}
                            <div className="space-y-6">
                                {/* Descrição */}
                                <div>
                                    <label
                                        htmlFor="descricao"
                                        className="block text-sm font-medium text-gray-300 mb-1"
                                    >
                                        Descrição
                                    </label>
                                    <textarea
                                        name="descricao"
                                        id="descricao"
                                        placeholder="Descrição"
                                        className="bg-[#404040] p-3 rounded-md w-96 h-[200px]  text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500" style={{ width: "140%" }}
                                        value={formData.descricao}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* DOD e DOR */}
                                <div className="grid grid-cols-2 gap-4 rounded-md h-[160px] " style={{ width: "140%"}}>
                                    <div >
                                        <label
                                            htmlFor="dod"
                                            className="block text-sm font-medium text-gray-300 mb-1 "
                                        >
                                            DOD
                                        </label>
                                        <textarea
                                            id="dod"
                                            name="dod"
                                            placeholder="Definição de pronto"
                                            className="bg-[#404040] p-3 rounded-md  w-full h-[200px] text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                                            value={formData.dod}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyDown}
                                            onFocus={handleFocus}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="dor"
                                            className="block text-sm font-medium text-gray-300 mb-1"
                                        >
                                            DOR
                                        </label>
                                        <textarea
                                            id="dor"
                                            name="dor"
                                            placeholder="Definição de iniciado"
                                            className="bg-[#404040] p-3 rounded-md w-full h-[200px] text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500"
                                            value={formData.dor}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyDown}
                                            onFocus={handleFocus}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coluna Direita: Tempo, Conteúdo de Apoio e Atributos */}
                            <div className="space-y-4 relative" style={{ width: "80%", height: "400px", marginLeft: "80px" ,paddingLeft: "20%" }}>
                                <div >
                                    <label
                                        htmlFor="tempo"
                                        className="block text-sm font-medium text-gray-300 mb-1"
                                    >
                                        Tempo
                                    </label>
                                    <input
                                        type="text"
                                        id="tempo"
                                        name="tempo"
                                        placeholder="Tempo (ex: 2d 4h)"
                                        className="bg-[#404040] p-2 rounded-md w-full text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                                        value={formData.tempo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="conteudoDeApoio"
                                        className="block text-sm font-medium text-gray-300 mb-1"
                                    >
                                        Conteúdo de Apoio
                                    </label>
                                    <textarea
                                        id="conteudoDeApoio"
                                        name="conteudoDeApoio"
                                        placeholder="Link ou detalhes do conteúdo de apoio"
                                        className="bg-[#404040] p-2 rounded-md w-full h-[60px] text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                                        value={formData.conteudoDeApoio}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <p className="text-md font-semibold text-gray-200 mb-2 h-">
                                        Atributos
                                    </p>
                                    <div className="grid gap-1">
                                        {[
                                            "Negócios",
                                            "Arquitetura",
                                            "FrontEnd",
                                            "BackEnd",
                                            "Design",
                                            "Data Analytics",
                                        ].map((item) => (
                                            <div key={item} className="flex items-center">
                                                <label
                                                    htmlFor={item.toLowerCase()}
                                                    className="text-gray-400 mr-2 w-16 shrink-0 text-right text-xs"
                                                >
                                                    {item}:
                                                </label>
                                                <input
                                                    type="text"
                                                    id={item.toLowerCase()}
                                                    name={item.toLowerCase()}
                                                    placeholder={`Digite ${item}`}
                                                    className="bg-[#404040] p-2 rounded-md w-full text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-xs"
                                                    value={
                                                        formData[
                                                            item.toLowerCase() as keyof FormData
                                                        ]
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botões no canto inferior direito */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Fechar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MinhaPagina;