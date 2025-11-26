// 👈 1. El ícono ahora se llama MagnifyingGlassIcon
// 👈 2. Se actualiza la ruta al nuevo paquete '20/solid' porque usas las clases "h-5 w-5"
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/20/solid'




const SearchBox = ({
    categories,
    search,
    onChange,
    onSubmit,
})=>{
    return(
      
            <form onSubmit={e => onSubmit(e)} className="relative" >
              
              <div>
                <div className="flex flex-direction-row justify-center items-center">
                 <div className="w-10 h-10 mr-[90px] flex flex-direction-row justify-center items-center">
    <img 
        src="/logop.png" 
        alt="" 
        className="w-full h-full block object-cover"
    />
    <span className='text-lg text-blue-600 font-bold'>ShopGPT</span>
</div>
                  <div className="flex items-center border border-gray-300 rounded-lg pl-4 pr-[6px] py-[6px] bg-white w-full lg:w-[512px]">
                  
                <div className="border-none after:content-['▼'] after:-ml-4 text-[#333333] text-[8px] flex flex-direction-row justify-center items-center relative ">
                    <select
                        onChange={e => onChange(e)}
                        name='category_id'
                       className="appearance-none bg-white border-none text-gray-700 text-sm font-medium  pr-6 py-0 cursor-pointer focus:outline-none focus:ring-0 bg-transparent w-10" 
                    >
                        <option className='text-xs' value={0}>All</option>
                        {
                            categories && 
                            categories !== null &&
                            categories !== undefined &&
                            categories.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        }

                    </select>
                </div>
                  
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <span className='w-[1px] bg-slate-500 h-5 block ml-3 mr-2 self-center'></span>
                    <input
                        type="search"
                        name="search"
                        onChange={e => onChange(e)}
                        value={search}
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-2 sm:text-sm border-gray-300"
                        placeholder="Que buscas hoy?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 focus:outline-none"
                  >
                    {/* 🕵️‍♂️ 3. Usamos el nuevo nombre del componente del ícono */}
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    
                  </button>
     </div>
                </div>
              </div>
            </form>
    )
}

export default SearchBox