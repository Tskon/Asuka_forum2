<template>
  <div class="admin-panel pb-3">
    <b-card
      class="events"
      no-body
    >
      <b-tabs card>
        <b-tab
          v-for="event in eventsForAdmin"
          :key="event.slug"
          :title="event.name"
        >
          <div class="event-tab">
            <GeneralState
              :current-event="event"
              class="event-tab__state"
            />
            <UsersTable
              class="event-tab__user-table"
              :users="adminData.users"
              :event="event"
            />
            <PlayersTable
              :users="adminData.users"
              :event-slug="event.slug"
              class="event-tab__players-table"
            />
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
    <CreateEvent class="new-event card card-body"/>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import GeneralState from './components/GeneralState'
import PlayersTable from './components/PlayersTable'
import CreateEvent from './components/CreateEvent'
import UsersTable from "./components/UsersTable"

export default {
  name: 'AdminPanelPage',

  components: {
    UsersTable,
    GeneralState,
    PlayersTable,
    CreateEvent
  },

  data() {
    return {
      data: null
    }
  },

  computed: {
    ...mapState({
      adminData: (state) => state.admin
    }),

    ...mapGetters({
      eventsForAdmin: 'admin/eventsForAdmin'
    })
  },

  created() {
    this.getAdminData()
    this.getLogs()
  },

  methods: {
    ...mapActions({
      getCurrentTurn: 'map/getCurrentTurn',
      getAdminData: 'admin/getAdminData',
      getLogs: 'admin/getLogs'
    })
  }
}
</script>

<style scoped lang="scss">
.admin-panel {
  margin-left: -15px;
  margin-right: -15px;
  padding: 20px;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  background-color: lighten($dark, 20%);

  @media (min-width: $md) {
    grid-template-columns: 1fr 1fr;

    .events {
      grid-column: 1 / span 2;
    }
  }

  @media (min-width: $xl) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.event-tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  &__players-table {
    grid-column: 1 / span 2;
  }
}
</style>
