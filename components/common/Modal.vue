<template>
    <!--    modal show-->
    <div id="{{ id }}" aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade"
        data-backdrop="static" data-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                
                <slot></slot>
                <!-- <button @click="$emit('close')">Close</button> -->
                <button class="btn btn-danger btn-sm text-white float-right mr-1" @click="close" type="button"
                    data-coreui-dismiss="modal">
                    Close
                </button>

            </div>
        </div>
    </div>
</template>

<script>
    const close = () => {
        $("#createFrom").modal("hide");
    };
</script>