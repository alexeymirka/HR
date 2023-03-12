import Login from "views/Login.js";
import Registration from "views/Registration.js";
import PositionsList from "views/PositionsList.js";
import AddPosition from "views/AddPosition.js";
import AddCandidate from "views/AddCandidate";
import CandidatesList from "views/CandidatesList";
import AddSkill from "views/AddSkill";
import HRProductivity from "views/HRProductivity";
import UpdateCandidate from "views/UpdateCandidate";

import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import SelectionList from "views/SelectionList";
import AddSelection from "views/AddSelection";
import SelectionInfo from "views/SelectionInfo";
import SelectionDetail from "views/SelectionDetail";

var routes = [
  {
    path: "/login",
    name: "Вход",
    icon: "tim-icons icon-attach-87",
    component: Login,
    layout: "/hr",
    show: false,
  },
  {
    path: "/registration",
    name: "Регистрация",
    icon: "tim-icons icon-attach-87",
    component: Registration,
    layout: "/hr",
    show: false,
  },
  {
    path: "/productivity",
    name: "Продуктивность HR",
    icon: "tim-icons icon-trophy",
    component: HRProductivity,
    layout: "/hr",
    show: false,
    admin: true,
  },
  {
    path: "/selection",
    name: "Отбор кандидатов",
    icon: "tim-icons icon-zoom-split",
    component: SelectionList,
    layout: "/hr",
    show: true,
  },
  {
    path: "/selection_info/:id",
    name: "Отбор кандидата",
    icon: "tim-icons icon-zoom-split",
    component: SelectionInfo,
    layout: "/hr",
    show: false,
  },
  {
    path: "/selection_detail/:id",
    name: "Отбор кандидата",
    icon: "tim-icons icon-zoom-split",
    component: SelectionDetail,
    layout: "/hr",
    show: false,
  },
  {
    path: "/candidates",
    name: "Кандидаты",
    icon: "tim-icons icon-badge",
    component: CandidatesList,
    layout: "/hr",
    show: true,
  },
  {
    path: "/candidate/:id",
    name: "Торт",
    icon: "nc-icon nc-circle-09",
    component: UpdateCandidate,
    layout: "/hr",
    show: false,
  },
  {
    path: "/positions",
    name: "Позиции",
    icon: "tim-icons icon-notes",
    component: PositionsList,
    layout: "/hr",
    show: true,
  },
  {
    path: "/add_skill",
    name: "Добавить навык",
    icon: "tim-icons icon-pencil",
    component: AddSkill,
    layout: "/hr",
    show: true,
  },
  {
    path: "/add_position",
    name: "Добавить позицию",
    icon: "tim-icons icon-pencil",
    component: AddPosition,
    layout: "/hr",
    show: true,
  },
  {
    path: "/add_candidate",
    name: "Добавить кандидата",
    icon: "tim-icons icon-pencil",
    component: AddCandidate,
    layout: "/hr",
    show: true,
  },
  {
    path: "/add_selection",
    name: "Начать отбор кандидата",
    icon: "tim-icons icon-pencil",
    component: AddSelection,
    layout: "/hr",
    show: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/hr",
    show: false,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/hr",
    show: false,
  },
];
export default routes;
