
import React from 'react';
import { PoliticalPosition, Person, UserRole, User } from './types';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.lugabus.ua/v1';

export const MOCK_USER: User = {
  id: 'u-1',
  username: 'Admin_User',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/seed/admin/100/100'
};

export const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Олександр "Зрадник" Петров',
    category: 'Політик',
    description: 'Колишній депутат, помічений у закликах до "миру на будь-яких умовах".',
    avatar: 'https://picsum.photos/seed/p1/200/200',
    position: PoliticalPosition.BETRAYAL,
    score: -85,
    proofsCount: 12,
    lastUpdated: '2023-10-15',
    proofs: [
      { id: 'pr-1', text: 'Заява на ефірі каналу Х про необхідність капітуляції.', sourceUrl: '#', date: '2023-09-12', likes: 120, dislikes: 5, status: 'APPROVED' }
    ],
    history: [
      { id: 'h1', date: '2022-02-24', title: 'Початок вторгнення', description: 'Залишився в Києві, але мовчав.', position: PoliticalPosition.NEUTRAL },
      { id: 'h2', date: '2023-09-12', title: 'Скандальна заява', description: 'Виступив із проросійськими наративами.', position: PoliticalPosition.BETRAYAL }
    ]
  },
  {
    id: '2',
    name: 'Марія Патріотка',
    category: 'Блогер',
    description: 'Активно допомагає ЗСУ, організовує збори на дрони.',
    avatar: 'https://picsum.photos/seed/p2/200/200',
    position: PoliticalPosition.SUPPORT,
    score: 98,
    proofsCount: 45,
    lastUpdated: '2023-10-20',
    proofs: [
      { id: 'pr-2', text: 'Звіт про передачу 100 дронів 3-й штурмовій.', sourceUrl: '#', date: '2023-10-18', likes: 450, dislikes: 2, status: 'APPROVED' }
    ],
    history: [
      { id: 'h3', date: '2022-02-24', title: 'Волонтерство', description: 'Створила фонд допомоги армії.', position: PoliticalPosition.SUPPORT }
    ]
  },
  {
    id: '3',
    name: 'Віктор "Тихоня" Іванов',
    category: 'Співак',
    description: 'Виїхав за кордон у березні 2022. Політичну позицію не висловлює.',
    avatar: 'https://picsum.photos/seed/p3/200/200',
    position: PoliticalPosition.NEUTRAL,
    score: 0,
    proofsCount: 3,
    lastUpdated: '2023-08-01',
    proofs: [
      { id: 'pr-3', text: 'Помічений на концерті в Дубаї під час обстрілів.', sourceUrl: '#', date: '2023-01-10', likes: 50, dislikes: 80, status: 'APPROVED' }
    ],
    history: [
      { id: 'h4', date: '2022-03-15', title: 'Виїзд', description: 'Покинув країну через кордон з Польщею.', position: PoliticalPosition.NEUTRAL }
    ]
  }
];

export const CATEGORIES = ['Всі', 'Політик', 'Блогер', 'Співак', 'Журналіст', 'Чиновник'];
