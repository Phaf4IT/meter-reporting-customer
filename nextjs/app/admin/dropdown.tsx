'use client';

import {useState} from 'react';
import {FiChevronDown} from 'react-icons/fi';
import Link from 'next/link';
import {EntityType} from "@/components/admin/entity-type/entityType";

interface DropdownProps {
    entityTypes: EntityType[];
    languageCode: string;
}

export default function Dropdown({entityTypes, languageCode}: DropdownProps) {
    const [isDropdownOpen, setDropdownOpen] = useState(true);

    return (
        <li>
            <div
                className="px-4 py-2 cursor-pointer flex justify-between items-center"
                onClick={() => setDropdownOpen(!isDropdownOpen)} // Toggle dropdown
            >
                <span>Entiteiten</span>
                <span
                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                >
          <FiChevronDown/>
        </span>
            </div>

            <ul
                className={`space-y-2 pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    isDropdownOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
            >
                {entityTypes.map((item) => <li key={item.name}>
                    <Link
                        href={`/admin/entity/${item.name}`}
                        className="block px-4 py-2 rounded hover:bg-cyan-800"
                    >
                        {
                            Object.entries(item.translations)
                                .filter(([key]) => key.startsWith(languageCode))
                                .map(([, value]) => value ? value[item.name] : item.name)
                                .find(() => true) || item.name
                        }
                    </Link>
                </li>)}
            </ul>
        </li>
    );
}
