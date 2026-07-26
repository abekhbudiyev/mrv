import type { RouteRecordRaw } from "vue-router";
import { eiProductionPageConfigs } from "@/features/ei/production-pages";

const EIProductionPage = () =>
  import("@/features/ei/pages/EIProductionPage.vue");
const EIAssessmentsPage = () =>
  import("@/features/ei/pages/EIAssessmentsPage.vue");

export const eiProductionRoutes: RouteRecordRaw[] =
  eiProductionPageConfigs.flatMap((page) => {
    const path = page.route.replace(/^\//, "");
    const isAssessmentsPage = page.key === "service-surveys";
    const component = isAssessmentsPage ? EIAssessmentsPage : EIProductionPage;
    const getProps = (mode: "list" | "view" | "edit") =>
      isAssessmentsPage ? { mode } : { pageKey: page.key, mode };
    const meta = {
      title: page.title,
      requiresAuth: true,
      moduleKey: "ei",
      moduleTitle: "Erta aralashuv moduli",
      breadcrumb: [
        "Ilovalar",
        "Erta aralashuv moduli",
        page.section,
        page.title,
      ],
    };
    const routes: RouteRecordRaw[] = [
      {
        path,
        name: `ei-production-${page.key}`,
        component,
        props: getProps("list"),
        meta,
      },
    ];

    if (page.kind === "dashboard") {
      return routes;
    }

    if (page.canView && page.kind !== "reference") {
      routes.unshift({
        path: `${path}/:id`,
        name: `ei-production-${page.key}-view`,
        component,
        props: getProps("view"),
        meta: {
          ...meta,
          title: `${page.title}: ko‘rish`,
          breadcrumb: [...meta.breadcrumb, "Ko‘rish"],
        },
      });
    }

    if (page.canEdit || page.canCreate) {
      routes.unshift({
        path: `${path}/:id/edit`,
        name: `ei-production-${page.key}-edit`,
        component,
        props: getProps("edit"),
        meta: {
          ...meta,
          title: `${page.title}: tahrirlash`,
          breadcrumb: [...meta.breadcrumb, "Tahrirlash"],
        },
      });
    }

    return routes;
  });
